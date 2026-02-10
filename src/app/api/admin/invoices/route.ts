// ============================================
// REKAIRE - Invoice Generation API
// Génère et stocke les factures PDF
// ============================================

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { 
  getOrderById, 
  getNextInvoiceNumber, 
  saveInvoiceUrl,
  isAdminWhitelisted,
  logAdminAction 
} from '@/lib/supabase-admin';
import { generateInvoicePDF, getInvoiceFileName, type InvoiceData } from '@/lib/invoice';
import { sendInvoiceEmail } from '@/lib/email';

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { autoRefreshToken: false, persistSession: false } }
);

// Middleware d'authentification admin
async function verifyAdminAuth(request: NextRequest): Promise<{ 
  authorized: boolean; 
  email?: string;
  error?: string;
}> {
  const authHeader = request.headers.get('authorization');
  
  if (!authHeader?.startsWith('Bearer ')) {
    return { authorized: false, error: 'Token manquant' };
  }

  const token = authHeader.substring(7);

  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    const { data: { user }, error } = await supabase.auth.getUser(token);

    if (error || !user?.email) {
      return { authorized: false, error: 'Token invalide' };
    }

    const isWhitelisted = await isAdminWhitelisted(user.email);
    if (!isWhitelisted) {
      return { authorized: false, error: 'Non autorisé' };
    }

    return { authorized: true, email: user.email };
  } catch {
    return { authorized: false, error: 'Erreur d\'authentification' };
  }
}

/**
 * POST /api/admin/invoices - Génère une facture pour une commande
 * Body: { orderId, sendEmail?: boolean }
 */
export async function POST(request: NextRequest) {
  const auth = await verifyAdminAuth(request);
  if (!auth.authorized) {
    return NextResponse.json({ error: auth.error }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { orderId, sendEmail = true } = body;

    if (!orderId) {
      return NextResponse.json({ error: 'orderId requis' }, { status: 400 });
    }

    // Récupérer la commande
    const order = await getOrderById(orderId);
    if (!order) {
      return NextResponse.json({ error: 'Commande non trouvée' }, { status: 404 });
    }

    // Vérifier si une facture existe déjà
    if (order.invoice_number) {
      return NextResponse.json({ 
        error: 'Facture déjà générée',
        invoiceNumber: order.invoice_number,
        invoiceUrl: order.invoice_url
      }, { status: 400 });
    }

    // Générer le numéro de facture
    const invoiceNumber = await getNextInvoiceNumber();

    // Préparer les données de la facture
    const invoiceData: InvoiceData = {
      invoiceNumber,
      orderNumber: order.order_number,
      date: new Date(order.created_at),
      customer: {
        name: order.customer_name || 'Client',
        email: order.customer_email,
        phone: order.customer_phone,
        address: {
          line1: order.shipping_address_line1 || 'Adresse non renseignée',
          line2: order.shipping_address_line2,
          postalCode: order.shipping_postal_code || '',
          city: order.shipping_city || '',
          country: order.shipping_country || 'France'
        }
      },
      items: [{
        description: 'RK01 - Extincteur automatique intelligent',
        quantity: order.quantity,
        unitPriceHT: order.unit_price_ht / 100, // Convertir de centimes en euros
        totalHT: (order.unit_price_ht * order.quantity) / 100
      }],
      promoCode: order.promo_code,
      promoDiscount: order.promo_discount ? order.promo_discount / 100 : undefined,
      totalHT: order.total_ht / 100,
      tvaRate: 0.20,
      tvaAmount: (order.total_ttc - order.total_ht) / 100,
      totalTTC: order.total_ttc / 100,
      isPaid: true,
      paymentMethod: 'Carte bancaire (Stripe)'
    };

    // Générer le PDF
    const pdfBuffer = await generateInvoicePDF(invoiceData);
    const fileName = getInvoiceFileName(invoiceNumber);

    // Upload vers Supabase Storage
    const { error: uploadError } = await supabaseAdmin.storage
      .from('invoices')
      .upload(fileName, pdfBuffer, {
        contentType: 'application/pdf',
        upsert: false
      });

    if (uploadError) {
      console.error('Upload error:', uploadError);
      // Si le bucket n'existe pas, créer une URL directe (fallback)
      // En production, le bucket doit être créé via le dashboard Supabase
    }

    // Générer l'URL signée (valable 7 jours)
    const { data: signedUrlData } = await supabaseAdmin.storage
      .from('invoices')
      .createSignedUrl(fileName, 60 * 60 * 24 * 7); // 7 jours

    const invoiceUrl = signedUrlData?.signedUrl || '';

    // Sauvegarder dans la commande
    await saveInvoiceUrl(orderId, invoiceNumber, invoiceUrl);

    // Log de l'action
    await logAdminAction(
      auth.email!,
      'GENERATE_INVOICE',
      'order',
      orderId,
      { invoiceNumber }
    );

    // Envoyer l'email avec la facture
    if (sendEmail && order.customer_email) {
      await sendInvoiceEmail({
        customerEmail: order.customer_email,
        customerName: order.customer_name,
        orderNumber: order.order_number,
        invoiceNumber,
        invoiceUrl,
        totalTTC: order.total_ttc / 100
      });
    }

    return NextResponse.json({
      success: true,
      invoiceNumber,
      invoiceUrl,
      emailSent: sendEmail
    });

  } catch (error) {
    console.error('Invoice generation error:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la génération de la facture' },
      { status: 500 }
    );
  }
}

/**
 * GET /api/admin/invoices?orderId=xxx - Télécharge directement le PDF de la facture
 * Régénère le PDF à la demande (pas de dépendance aux URLs expirées)
 */
export async function GET(request: NextRequest) {
  const auth = await verifyAdminAuth(request);
  if (!auth.authorized) {
    return NextResponse.json({ error: auth.error }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const orderId = searchParams.get('orderId');

  if (!orderId) {
    return NextResponse.json({ error: 'orderId requis' }, { status: 400 });
  }

  const order = await getOrderById(orderId);
  if (!order) {
    return NextResponse.json({ error: 'Commande non trouvée' }, { status: 404 });
  }

  if (!order.invoice_number) {
    return NextResponse.json({ error: 'Aucune facture générée' }, { status: 404 });
  }

  // Régénérer le PDF à la demande
  const invoiceData: InvoiceData = {
    invoiceNumber: order.invoice_number,
    orderNumber: order.order_number,
    date: new Date(order.created_at),
    customer: {
      name: order.customer_name || 'Client',
      email: order.customer_email,
      phone: order.customer_phone,
      address: {
        line1: order.shipping_address_line1 || 'Adresse non renseignée',
        line2: order.shipping_address_line2,
        postalCode: order.shipping_postal_code || '',
        city: order.shipping_city || '',
        country: order.shipping_country || 'France'
      }
    },
    items: [{
      description: 'RK01 - Extincteur automatique intelligent',
      quantity: order.quantity,
      unitPriceHT: order.unit_price_ht / 100,
      totalHT: (order.unit_price_ht * order.quantity) / 100
    }],
    promoCode: order.promo_code,
    promoDiscount: order.promo_discount ? order.promo_discount / 100 : undefined,
    totalHT: order.total_ht / 100,
    tvaRate: 0.20,
    tvaAmount: (order.total_ttc - order.total_ht) / 100,
    totalTTC: order.total_ttc / 100,
    isPaid: true,
    paymentMethod: 'Carte bancaire (Stripe)'
  };

  const pdfBuffer = await generateInvoicePDF(invoiceData);
  const fileName = getInvoiceFileName(order.invoice_number);

  // Retourner le PDF directement (convertir Buffer en Uint8Array pour Response)
  return new Response(new Uint8Array(pdfBuffer), {
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="${fileName}"`,
      'Cache-Control': 'no-cache'
    }
  });
}
