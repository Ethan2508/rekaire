// ============================================
// REKAIRE - API Admin Tracking
// Enregistre le numéro de suivi et envoie l'email automatiquement
// ============================================

import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { sendShippingEmail } from "@/lib/email";

// Admin emails autorisés - support ADMIN_EMAILS et ADMIN_EMAIL
const adminEmailsEnv = process.env.ADMIN_EMAILS || process.env.ADMIN_EMAIL || '';
const ADMIN_EMAILS = adminEmailsEnv.split(',').map(e => e.trim().toLowerCase()).filter(e => e);

// Supabase admin client
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// Mapping des transporteurs vers leurs URLs de suivi
const CARRIER_TRACKING_URLS: Record<string, string> = {
  colissimo: "https://www.laposte.fr/outils/suivre-vos-envois?code=",
  chronopost: "https://www.chronopost.fr/tracking-no-cms/suivi-page?liession=",
  mondialrelay: "https://www.mondialrelay.fr/suivi-de-colis/?numeroExpedition=",
  ups: "https://www.ups.com/track?loc=fr_FR&tracknum=",
  dhl: "https://www.dhl.com/fr-fr/home/tracking/tracking-express.html?submit=1&tracking-id=",
  fedex: "https://www.fedex.com/fedextrack/?trknbr=",
  gls: "https://gls-group.eu/FR/fr/suivi-colis?match=",
  dpd: "https://trace.dpd.fr/fr/trace/",
};

// Détecte automatiquement le transporteur depuis le numéro
function detectCarrier(trackingNumber: string): { carrier: string; url: string } {
  const num = trackingNumber.toUpperCase().trim();
  
  // Colissimo: commence par des chiffres, 13-15 caractères
  if (/^\d{13,15}$/.test(num) || /^[A-Z]{2}\d{9}[A-Z]{2}$/.test(num)) {
    return { carrier: "Colissimo", url: CARRIER_TRACKING_URLS.colissimo + num };
  }
  
  // Chronopost: commence souvent par des lettres puis chiffres
  if (/^[A-Z]{2}\d{10,}$/.test(num) || num.startsWith("XY")) {
    return { carrier: "Chronopost", url: CARRIER_TRACKING_URLS.chronopost + num };
  }
  
  // Mondial Relay: 8-10 chiffres
  if (/^\d{8,10}$/.test(num)) {
    return { carrier: "Mondial Relay", url: CARRIER_TRACKING_URLS.mondialrelay + num };
  }
  
  // UPS: 1Z suivi de caractères
  if (num.startsWith("1Z")) {
    return { carrier: "UPS", url: CARRIER_TRACKING_URLS.ups + num };
  }
  
  // DHL: 10-11 chiffres
  if (/^\d{10,11}$/.test(num)) {
    return { carrier: "DHL", url: CARRIER_TRACKING_URLS.dhl + num };
  }
  
  // FedEx: 12-22 chiffres
  if (/^\d{12,22}$/.test(num)) {
    return { carrier: "FedEx", url: CARRIER_TRACKING_URLS.fedex + num };
  }
  
  // Par défaut: Colissimo (le plus courant en France)
  return { carrier: "Colissimo", url: CARRIER_TRACKING_URLS.colissimo + num };
}

// POST - Ajouter un numéro de suivi et envoyer l'email
export async function POST(request: NextRequest) {
  try {
    // Vérifier l'authentification admin
    const authHeader = request.headers.get("authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const token = authHeader.split(" ")[1];
    const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(token);

    if (authError || !user?.email || !ADMIN_EMAILS.includes(user.email.toLowerCase())) {
      return NextResponse.json({ error: "Accès refusé" }, { status: 403 });
    }

    const body = await request.json();
    const { orderId, trackingNumber, carrier: providedCarrier } = body;

    if (!orderId || !trackingNumber) {
      return NextResponse.json(
        { error: "orderId et trackingNumber requis" },
        { status: 400 }
      );
    }

    // Détecter le transporteur ou utiliser celui fourni
    const { carrier: detectedCarrier, url: detectedUrl } = detectCarrier(trackingNumber);
    const carrier = providedCarrier || detectedCarrier;
    const trackingUrl = providedCarrier 
      ? (CARRIER_TRACKING_URLS[providedCarrier.toLowerCase()] || CARRIER_TRACKING_URLS.colissimo) + trackingNumber
      : detectedUrl;

    // Récupérer la commande
    const { data: order, error: orderError } = await supabaseAdmin
      .from("orders")
      .select("*")
      .eq("id", orderId)
      .single();

    if (orderError || !order) {
      return NextResponse.json({ error: "Commande non trouvée" }, { status: 404 });
    }

    // Vérifier qu'il n'y a pas déjà un numéro de suivi
    if (order.tracking_number) {
      return NextResponse.json(
        { error: "Un numéro de suivi existe déjà pour cette commande", existing: order.tracking_number },
        { status: 400 }
      );
    }

    // Mettre à jour la commande
    const { error: updateError } = await supabaseAdmin
      .from("orders")
      .update({
        tracking_number: trackingNumber,
        tracking_url: trackingUrl,
        status: "shipped",
        shipped_at: new Date().toISOString(),
      })
      .eq("id", orderId);

    if (updateError) {
      console.error("[Tracking] Update error:", updateError);
      return NextResponse.json({ 
        error: "Erreur mise à jour", 
        details: updateError.message,
        code: updateError.code 
      }, { status: 500 });
    }

    // Envoyer l'email de suivi au client
    if (order.customer_email) {
      const emailResult = await sendShippingEmail({
        customerEmail: order.customer_email,
        customerName: order.customer_name || undefined,
        orderNumber: order.order_number || orderId.substring(0, 8).toUpperCase(),
        trackingNumber: trackingNumber,
        trackingUrl: trackingUrl,
        carrier: carrier,
      });

      if (!emailResult.success) {
        console.error("[Tracking] Email failed:", emailResult.error);
        // On ne fail pas la requête, le tracking est quand même enregistré
      }
    }

    // Logger l'action
    await supabaseAdmin.from("admin_audit_log").insert({
      admin_email: user.email,
      action: "add_tracking",
      target_type: "order",
      target_id: orderId,
      details: {
        tracking_number: trackingNumber,
        carrier: carrier,
        tracking_url: trackingUrl,
        customer_email: order.customer_email,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Numéro de suivi ajouté et email envoyé",
      data: {
        trackingNumber,
        carrier,
        trackingUrl,
        emailSent: !!order.customer_email,
      },
    });

  } catch (error) {
    console.error("[Tracking API] Error:", error);
    return NextResponse.json(
      { error: "Erreur serveur" },
      { status: 500 }
    );
  }
}

// PATCH - Mettre à jour le statut (livré, etc.)
export async function PATCH(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const token = authHeader.split(" ")[1];
    const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(token);

    if (authError || !user?.email || !ADMIN_EMAILS.includes(user.email.toLowerCase())) {
      return NextResponse.json({ error: "Accès refusé" }, { status: 403 });
    }

    const body = await request.json();
    const { orderId, status } = body;

    if (!orderId || !status) {
      return NextResponse.json({ error: "orderId et status requis" }, { status: 400 });
    }

    const validStatuses = ["paid", "shipped", "delivered", "cancelled"];
    if (!validStatuses.includes(status)) {
      return NextResponse.json({ error: "Statut invalide" }, { status: 400 });
    }

    const updateData: Record<string, unknown> = { status };
    
    if (status === "delivered") {
      updateData.delivered_at = new Date().toISOString();
    }

    const { error: updateError } = await supabaseAdmin
      .from("orders")
      .update(updateData)
      .eq("id", orderId);

    if (updateError) {
      return NextResponse.json({ error: "Erreur mise à jour" }, { status: 500 });
    }

    // Logger l'action
    await supabaseAdmin.from("admin_audit_log").insert({
      admin_email: user.email,
      action: "update_status",
      target_type: "order",
      target_id: orderId,
      details: { new_status: status },
    });

    return NextResponse.json({ success: true, status });

  } catch (error) {
    console.error("[Tracking API] PATCH Error:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
