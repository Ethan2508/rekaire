// ============================================
// REKAIRE - Email Utilities (Resend)
// ============================================

import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

const FROM_EMAIL = process.env.EMAIL_FROM || "contact@rekaire.fr";
const FROM_NAME = "Rekaire";

// Infos entreprise pour les factures
const COMPANY_INFO = {
  name: "NELIOR SAS",
  brand: "Rekaire",
  address: "5 Rue Mazenod",
  city: "69003 LYON",
  country: "France",
  siren: "989 603 907",
  siret: "989 603 907 00019",
  tva: "FR51989603907",
  rcs: "989 603 907 R.C.S. Lyon",
  capital: "1 260,00 €",
  email: "contact@rekaire.fr",
  phone: "+33 4 82 53 06 19",
  website: "www.rekaire.fr",
  logo: "https://www.rekaire.fr/images/logo.png",
};

const TVA_RATE = 0.20;

export interface OrderEmailData {
  orderId: string;
  customerEmail: string;
  customerName?: string;
  customerPhone?: string;
  productName: string;
  quantity: number;
  unitPriceCents: number; // Prix unitaire TTC
  amountCents: number; // Total TTC
  currency: string;
  shippingAddress?: {
    name?: string;
    line1?: string;
    line2?: string;
    city?: string;
    postalCode?: string;
    country?: string;
  };
  billingAddress?: {
    name?: string;
    line1?: string;
    line2?: string;
    city?: string;
    postalCode?: string;
    country?: string;
  };
  promoCode?: string;
  discountCents?: number;
  stripePaymentId?: string;
  invoiceUrl?: string; // URL de la facture Stripe (obsolète, utiliser invoicePdf)
  invoiceNumber?: string;
  // Facture PDF maison en pièce jointe
  invoicePdf?: {
    content: string; // Base64
    filename: string;
  };
}

// Email de confirmation de commande (CLIENT)
export async function sendOrderConfirmationEmail(data: OrderEmailData) {
  const totalTTC = (data.amountCents / 100).toFixed(2);
  const totalHT = (data.amountCents / 100 / (1 + TVA_RATE)).toFixed(2);
  const tvaAmount = ((data.amountCents / 100) - parseFloat(totalHT)).toFixed(2);
  const unitPrice = data.unitPriceCents ? (data.unitPriceCents / 100).toFixed(2) : (data.amountCents / 100 / data.quantity).toFixed(2);
  const unitPriceHT = (parseFloat(unitPrice) / (1 + TVA_RATE)).toFixed(2);
  
  const orderDate = new Date().toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric'
  });
  
  const discount = data.discountCents ? (data.discountCents / 100).toFixed(2) : null;
  const subtotalBeforeDiscount = discount 
    ? ((data.amountCents + data.discountCents!) / 100).toFixed(2) 
    : null;
  
  try {
    const result = await resend.emails.send({
      from: `${FROM_NAME} <${FROM_EMAIL}>`,
      to: data.customerEmail,
      subject: `Confirmation de commande ${data.orderId} - Rekaire`,
      html: `
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Confirmation de commande</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f4f4f5; color: #18181b;">
  
  <!-- Container principal -->
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f4f4f5; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);">
          
          <!-- Header avec logo -->
          <tr>
            <td style="background: linear-gradient(135deg, #0a0a0a 0%, #1f1f1f 100%); padding: 30px 40px; text-align: center;">
              <img src="${COMPANY_INFO.logo}" alt="Rekaire" style="max-width: 180px; height: auto; margin-bottom: 10px;" />
            </td>
          </tr>
          
          <!-- Message de succès -->
          <tr>
            <td style="padding: 40px 40px 20px; text-align: center;">
              <div style="display: inline-block; width: 60px; height: 60px; background-color: #dcfce7; border-radius: 50%; line-height: 60px; font-size: 30px; margin-bottom: 20px;">✓</div>
              <h2 style="margin: 0 0 10px; font-size: 24px; color: #18181b;">Merci pour votre commande !</h2>
              <p style="margin: 0; color: #71717a; font-size: 15px;">
                ${data.customerName ? `Bonjour ${data.customerName}, ` : ''}Votre commande a été confirmée et sera préparée dans les plus brefs délais.
              </p>
            </td>
          </tr>
          
          <!-- Infos commande -->
          <tr>
            <td style="padding: 20px 40px;">
              <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #fafafa; border-radius: 8px; padding: 20px;">
                <tr>
                  <td>
                    <table width="100%" cellpadding="0" cellspacing="0">
                      <tr>
                        <td width="50%" style="padding: 10px 20px; vertical-align: top;">
                          <p style="margin: 0 0 5px; font-size: 12px; color: #71717a; text-transform: uppercase; letter-spacing: 0.5px;">N° de commande</p>
                          <p style="margin: 0; font-size: 15px; font-weight: 600; color: #eb5122;">${data.orderId}</p>
                        </td>
                        <td width="50%" style="padding: 10px 20px; vertical-align: top;">
                          <p style="margin: 0 0 5px; font-size: 12px; color: #71717a; text-transform: uppercase; letter-spacing: 0.5px;">Date de commande</p>
                          <p style="margin: 0; font-size: 15px; font-weight: 600; color: #18181b;">${orderDate}</p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          
          <!-- Détails de la commande (style facture) -->
          <tr>
            <td style="padding: 20px 40px;">
              <h3 style="margin: 0 0 15px; font-size: 16px; color: #18181b; border-bottom: 2px solid #e4e4e7; padding-bottom: 10px;">📦 Détails de votre commande</h3>
              
              <!-- En-tête tableau -->
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr style="background-color: #f4f4f5;">
                  <td style="padding: 12px 15px; font-size: 12px; color: #71717a; text-transform: uppercase; letter-spacing: 0.5px; font-weight: 600;">Produit</td>
                  <td style="padding: 12px 15px; font-size: 12px; color: #71717a; text-transform: uppercase; letter-spacing: 0.5px; font-weight: 600; text-align: center;">Qté</td>
                  <td style="padding: 12px 15px; font-size: 12px; color: #71717a; text-transform: uppercase; letter-spacing: 0.5px; font-weight: 600; text-align: right;">P.U. HT</td>
                  <td style="padding: 12px 15px; font-size: 12px; color: #71717a; text-transform: uppercase; letter-spacing: 0.5px; font-weight: 600; text-align: right;">Total HT</td>
                </tr>
                
                <!-- Ligne produit -->
                <tr>
                  <td style="padding: 15px; border-bottom: 1px solid #e4e4e7;">
                    <p style="margin: 0; font-size: 14px; font-weight: 600; color: #18181b;">${data.productName}</p>
                    <p style="margin: 5px 0 0; font-size: 12px; color: #71717a;">Réf: RK01</p>
                  </td>
                  <td style="padding: 15px; border-bottom: 1px solid #e4e4e7; text-align: center; font-size: 14px;">${data.quantity}</td>
                  <td style="padding: 15px; border-bottom: 1px solid #e4e4e7; text-align: right; font-size: 14px;">${unitPriceHT} €</td>
                  <td style="padding: 15px; border-bottom: 1px solid #e4e4e7; text-align: right; font-size: 14px;">${(parseFloat(unitPriceHT) * data.quantity).toFixed(2)} €</td>
                </tr>
              </table>
              
              <!-- Totaux -->
              <table width="100%" cellpadding="0" cellspacing="0" style="margin-top: 15px;">
                ${discount ? `
                <tr>
                  <td style="padding: 8px 15px; font-size: 14px; color: #71717a;">Sous-total HT</td>
                  <td style="padding: 8px 15px; font-size: 14px; text-align: right;">${(parseFloat(subtotalBeforeDiscount!) / (1 + TVA_RATE)).toFixed(2)} €</td>
                </tr>
                <tr>
                  <td style="padding: 8px 15px; font-size: 14px; color: #16a34a;">
                    Réduction${data.promoCode ? ` (${data.promoCode})` : ''}
                  </td>
                  <td style="padding: 8px 15px; font-size: 14px; text-align: right; color: #16a34a;">-${(parseFloat(discount) / (1 + TVA_RATE)).toFixed(2)} €</td>
                </tr>
                ` : ''}
                <tr>
                  <td style="padding: 8px 15px; font-size: 14px; color: #71717a;">Total HT</td>
                  <td style="padding: 8px 15px; font-size: 14px; text-align: right;">${totalHT} €</td>
                </tr>
                <tr>
                  <td style="padding: 8px 15px; font-size: 14px; color: #71717a;">TVA (20%)</td>
                  <td style="padding: 8px 15px; font-size: 14px; text-align: right;">${tvaAmount} €</td>
                </tr>
                <tr>
                  <td style="padding: 12px 15px; font-size: 18px; font-weight: 700; color: #18181b; border-top: 2px solid #18181b;">Total TTC</td>
                  <td style="padding: 12px 15px; font-size: 18px; font-weight: 700; text-align: right; color: #eb5122; border-top: 2px solid #18181b;">${totalTTC} €</td>
                </tr>
              </table>
            </td>
          </tr>
          
          <!-- Adresses -->
          <tr>
            <td style="padding: 20px 40px;">
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  ${data.shippingAddress ? `
                  <td width="50%" style="vertical-align: top; padding-right: 15px;">
                    <h4 style="margin: 0 0 10px; font-size: 13px; color: #71717a; text-transform: uppercase; letter-spacing: 0.5px;">📍 Livraison</h4>
                    <div style="background-color: #fafafa; border-radius: 8px; padding: 15px;">
                      <p style="margin: 0; font-size: 14px; line-height: 1.6; color: #18181b;">
                        ${data.shippingAddress.name || data.customerName || ''}<br>
                        ${data.shippingAddress.line1 || ''}<br>
                        ${data.shippingAddress.line2 ? data.shippingAddress.line2 + '<br>' : ''}
                        ${data.shippingAddress.postalCode || ''} ${data.shippingAddress.city || ''}<br>
                        ${data.shippingAddress.country || 'France'}
                      </p>
                    </div>
                  </td>
                  ` : ''}
                  <td width="50%" style="vertical-align: top; padding-left: 15px;">
                    <h4 style="margin: 0 0 10px; font-size: 13px; color: #71717a; text-transform: uppercase; letter-spacing: 0.5px;">🧾 Facturation</h4>
                    <div style="background-color: #fafafa; border-radius: 8px; padding: 15px;">
                      <p style="margin: 0; font-size: 14px; line-height: 1.6; color: #18181b;">
                        ${data.billingAddress?.name || data.customerName || ''}<br>
                        ${data.billingAddress?.line1 || data.shippingAddress?.line1 || ''}<br>
                        ${data.billingAddress?.postalCode || data.shippingAddress?.postalCode || ''} ${data.billingAddress?.city || data.shippingAddress?.city || ''}<br>
                        ${data.billingAddress?.country || data.shippingAddress?.country || 'France'}
                      </p>
                    </div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          
          <!-- Prochaines étapes -->
          <tr>
            <td style="padding: 20px 40px;">
              <div style="background: linear-gradient(135deg, #fef3c7 0%, #fef9c3 100%); border-radius: 8px; padding: 20px; border-left: 4px solid #f59e0b;">
                <h4 style="margin: 0 0 10px; font-size: 14px; color: #92400e;">🚚 Prochaines étapes</h4>
                <ol style="margin: 0; padding-left: 20px; font-size: 14px; color: #78350f; line-height: 1.8;">
                  <li>Nous préparons votre commande sous 24-48h</li>
                  <li>Vous recevrez un email avec le numéro de suivi</li>
                  <li>Livraison estimée sous 2-4 jours ouvrés</li>
                </ol>
              </div>
            </td>
          </tr>
          
          ${data.invoiceUrl ? `
          <!-- Bouton facture -->
          <tr>
            <td style="padding: 10px 40px 30px; text-align: center;">
              <a href="${data.invoiceUrl}" target="_blank" style="display: inline-block; padding: 14px 28px; background: #18181b; color: #ffffff; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 14px;">
                📄 Télécharger ma facture PDF
              </a>
              <p style="margin: 10px 0 0; font-size: 12px; color: #71717a;">
                ${data.invoiceNumber ? 'Facture N° ' + data.invoiceNumber : 'Facture disponible en téléchargement'}
              </p>
            </td>
          </tr>
          ` : ''}
          
          <!-- Mentions légales -->
          <tr>
            <td style="padding: 30px 40px; background-color: #fafafa; border-top: 1px solid #e4e4e7;">
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="font-size: 11px; color: #71717a; line-height: 1.6;">
                    <p style="margin: 0 0 10px;"><strong>Vendeur :</strong> ${COMPANY_INFO.name}</p>
                    <p style="margin: 0 0 5px;">SIREN : ${COMPANY_INFO.siren} | SIRET : ${COMPANY_INFO.siret}</p>
                    <p style="margin: 0 0 5px;">TVA : ${COMPANY_INFO.tva} | RCS : ${COMPANY_INFO.rcs}</p>
                    <p style="margin: 0 0 5px;">Capital social : ${COMPANY_INFO.capital}</p>
                    <p style="margin: 0 0 5px;">${COMPANY_INFO.address}, ${COMPANY_INFO.city}</p>
                    <p style="margin: 0;">${data.invoiceUrl ? 'Votre facture officielle est disponible via le bouton ci-dessus.' : 'Ce document tient lieu de facture. Conservez-le pour vos archives.'}</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="background-color: #18181b; padding: 30px 40px; text-align: center;">
              <p style="margin: 0 0 10px; font-size: 14px; color: #ffffff;">
                Une question ? Contactez-nous
              </p>
              <p style="margin: 0 0 20px;">
                <a href="mailto:${COMPANY_INFO.email}" style="color: #eb5122; text-decoration: none; font-weight: 600;">${COMPANY_INFO.email}</a>
                &nbsp;|&nbsp;
                <a href="tel:${COMPANY_INFO.phone.replace(/\s/g, '')}" style="color: #eb5122; text-decoration: none; font-weight: 600;">${COMPANY_INFO.phone}</a>
              </p>
              <p style="margin: 0; font-size: 12px; color: #71717a;">
                © ${new Date().getFullYear()} Rekaire. Tous droits réservés.<br>
                <a href="https://www.rekaire.fr/cgv" style="color: #71717a;">CGV</a> | 
                <a href="https://www.rekaire.fr/confidentialite" style="color: #71717a;">Confidentialité</a>
              </p>
            </td>
          </tr>
          
        </table>
      </td>
    </tr>
  </table>
  
</body>
</html>
      `,
      text: `
═══════════════════════════════════════════════════════════
REKAIRE - Confirmation de commande
═══════════════════════════════════════════════════════════

${data.customerName ? `Bonjour ${data.customerName},` : 'Bonjour,'}

Merci pour votre commande ! Votre paiement a été confirmé.

───────────────────────────────────────────────────────────
DÉTAILS DE LA COMMANDE
───────────────────────────────────────────────────────────

N° de commande : ${data.orderId}
Date : ${orderDate}

Produit : ${data.productName}
Quantité : ${data.quantity}
Prix unitaire HT : ${unitPriceHT} €

${discount ? `Sous-total HT : ${(parseFloat(subtotalBeforeDiscount!) / (1 + TVA_RATE)).toFixed(2)} €
Réduction${data.promoCode ? ` (${data.promoCode})` : ''} : -${(parseFloat(discount) / (1 + TVA_RATE)).toFixed(2)} €
` : ''}Total HT : ${totalHT} €
TVA (20%) : ${tvaAmount} €
───────────────────────────────────────────────────────────
TOTAL TTC : ${totalTTC} €
───────────────────────────────────────────────────────────

${data.shippingAddress ? `
ADRESSE DE LIVRAISON :
${data.shippingAddress.name || data.customerName || ''}
${data.shippingAddress.line1 || ''}
${data.shippingAddress.line2 || ''}
${data.shippingAddress.postalCode || ''} ${data.shippingAddress.city || ''}
${data.shippingAddress.country || 'France'}
` : ''}

PROCHAINES ÉTAPES :
1. Nous préparons votre commande sous 24-48h
2. Vous recevrez un email avec le numéro de suivi
3. Livraison estimée sous 2-4 jours ouvrés

───────────────────────────────────────────────────────────

Vendeur : ${COMPANY_INFO.name}
SIRET : ${COMPANY_INFO.siret} | TVA : ${COMPANY_INFO.tva}
${COMPANY_INFO.address}, ${COMPANY_INFO.city}

Ce document tient lieu de facture.

Une question ? ${COMPANY_INFO.email} | ${COMPANY_INFO.phone}

© ${new Date().getFullYear()} Rekaire - www.rekaire.fr
      `,
      // Pièce jointe facture PDF si fournie
      ...(data.invoicePdf && {
        attachments: [{
          filename: data.invoicePdf.filename,
          content: data.invoicePdf.content,
        }],
      }),
    });

    return { success: true, data: result };
  } catch (error) {
    console.error("[Email] Failed to send confirmation:", error);
    return { success: false, error };
  }
}

// Email de notification admin (DÉTAILLÉ)
export async function sendAdminNotificationEmail(data: OrderEmailData) {
  const adminEmail = process.env.ADMIN_EMAIL || "admin@rekaire.fr";
  const totalTTC = (data.amountCents / 100).toFixed(2);
  const totalHT = (data.amountCents / 100 / (1 + TVA_RATE)).toFixed(2);
  const tvaAmount = ((data.amountCents / 100) - parseFloat(totalHT)).toFixed(2);
  const unitPrice = data.unitPriceCents ? (data.unitPriceCents / 100).toFixed(2) : (data.amountCents / 100 / data.quantity).toFixed(2);
  const unitPriceHT = (parseFloat(unitPrice) / (1 + TVA_RATE)).toFixed(2);
  
  const orderDate = new Date().toLocaleDateString('fr-FR', {
    weekday: 'long',
    day: '2-digit',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
  
  const discount = data.discountCents ? (data.discountCents / 100).toFixed(2) : null;

  try {
    const result = await resend.emails.send({
      from: `${FROM_NAME} <${FROM_EMAIL}>`,
      to: adminEmail,
      subject: `🔔 NOUVELLE COMMANDE ${data.orderId} - ${totalTTC}€`,
      html: `
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #f4f4f5;">
  
  <table width="100%" cellpadding="0" cellspacing="0" style="padding: 30px 20px;">
    <tr>
      <td align="center">
        <table width="650" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);">
          
          <!-- Header Alert -->
          <tr>
            <td style="background: linear-gradient(135deg, #16a34a 0%, #15803d 100%); padding: 25px 30px;">
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td>
                    <h1 style="margin: 0; font-size: 24px; color: #ffffff;">🎉 Nouvelle commande !</h1>
                    <p style="margin: 8px 0 0; font-size: 14px; color: rgba(255,255,255,0.9);">${orderDate}</p>
                  </td>
                  <td style="text-align: right;">
                    <div style="background: rgba(255,255,255,0.2); border-radius: 8px; padding: 12px 20px; display: inline-block;">
                      <p style="margin: 0; font-size: 12px; color: rgba(255,255,255,0.8);">TOTAL TTC</p>
                      <p style="margin: 5px 0 0; font-size: 28px; font-weight: 700; color: #ffffff;">${totalTTC} €</p>
                    </div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          
          <!-- Infos commande rapides -->
          <tr>
            <td style="padding: 25px 30px; background-color: #fafafa; border-bottom: 1px solid #e4e4e7;">
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td width="33%" style="padding: 10px;">
                    <p style="margin: 0 0 5px; font-size: 11px; color: #71717a; text-transform: uppercase; letter-spacing: 0.5px;">N° Commande</p>
                    <p style="margin: 0; font-size: 16px; font-weight: 700; color: #eb5122;">${data.orderId}</p>
                  </td>
                  <td width="33%" style="padding: 10px;">
                    <p style="margin: 0 0 5px; font-size: 11px; color: #71717a; text-transform: uppercase; letter-spacing: 0.5px;">Quantité</p>
                    <p style="margin: 0; font-size: 16px; font-weight: 700; color: #18181b;">${data.quantity} × RK01</p>
                  </td>
                  <td width="33%" style="padding: 10px;">
                    <p style="margin: 0 0 5px; font-size: 11px; color: #71717a; text-transform: uppercase; letter-spacing: 0.5px;">Statut paiement</p>
                    <p style="margin: 0; font-size: 14px; font-weight: 600; color: #16a34a;">✓ Payé via Stripe</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          
          <!-- Client Info -->
          <tr>
            <td style="padding: 25px 30px;">
              <h3 style="margin: 0 0 15px; font-size: 14px; color: #71717a; text-transform: uppercase; letter-spacing: 0.5px; border-bottom: 1px solid #e4e4e7; padding-bottom: 10px;">
                👤 Informations client
              </h3>
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td width="50%" style="padding: 8px 0; vertical-align: top;">
                    <p style="margin: 0 0 3px; font-size: 12px; color: #71717a;">Nom</p>
                    <p style="margin: 0; font-size: 15px; font-weight: 600; color: #18181b;">${data.customerName || 'Non renseigné'}</p>
                  </td>
                  <td width="50%" style="padding: 8px 0; vertical-align: top;">
                    <p style="margin: 0 0 3px; font-size: 12px; color: #71717a;">Email</p>
                    <p style="margin: 0; font-size: 15px; color: #18181b;">
                      <a href="mailto:${data.customerEmail}" style="color: #2563eb; text-decoration: none;">${data.customerEmail}</a>
                    </p>
                  </td>
                </tr>
                <tr>
                  <td width="50%" style="padding: 8px 0; vertical-align: top;">
                    <p style="margin: 0 0 3px; font-size: 12px; color: #71717a;">Téléphone</p>
                    <p style="margin: 0; font-size: 15px; color: #18181b;">${data.customerPhone || 'Non renseigné'}</p>
                  </td>
                  <td width="50%" style="padding: 8px 0; vertical-align: top;">
                    <p style="margin: 0 0 3px; font-size: 12px; color: #71717a;">Réf. Stripe</p>
                    <p style="margin: 0; font-size: 13px; color: #71717a; font-family: monospace;">${data.stripePaymentId || 'N/A'}</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          
          <!-- Adresse de livraison -->
          ${data.shippingAddress ? `
          <tr>
            <td style="padding: 0 30px 25px;">
              <div style="background-color: #eff6ff; border-radius: 8px; padding: 20px; border-left: 4px solid #3b82f6;">
                <h4 style="margin: 0 0 10px; font-size: 13px; color: #1e40af; text-transform: uppercase; letter-spacing: 0.5px;">📍 Adresse de livraison</h4>
                <p style="margin: 0; font-size: 15px; line-height: 1.7; color: #1e3a8a;">
                  <strong>${data.shippingAddress.name || data.customerName || ''}</strong><br>
                  ${data.shippingAddress.line1 || ''}<br>
                  ${data.shippingAddress.line2 ? data.shippingAddress.line2 + '<br>' : ''}
                  <strong>${data.shippingAddress.postalCode || ''} ${data.shippingAddress.city || ''}</strong><br>
                  ${data.shippingAddress.country || 'France'}
                </p>
              </div>
            </td>
          </tr>
          ` : ''}
          
          <!-- Détail financier -->
          <tr>
            <td style="padding: 0 30px 25px;">
              <h3 style="margin: 0 0 15px; font-size: 14px; color: #71717a; text-transform: uppercase; letter-spacing: 0.5px; border-bottom: 1px solid #e4e4e7; padding-bottom: 10px;">
                💰 Détail financier
              </h3>
              <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #fafafa; border-radius: 8px;">
                <tr>
                  <td style="padding: 12px 15px; border-bottom: 1px solid #e4e4e7;">
                    <span style="font-size: 14px; color: #18181b;">${data.productName}</span>
                  </td>
                  <td style="padding: 12px 15px; border-bottom: 1px solid #e4e4e7; text-align: center; font-size: 14px;">× ${data.quantity}</td>
                  <td style="padding: 12px 15px; border-bottom: 1px solid #e4e4e7; text-align: right; font-size: 14px;">${unitPriceHT} € HT</td>
                  <td style="padding: 12px 15px; border-bottom: 1px solid #e4e4e7; text-align: right; font-size: 14px; font-weight: 600;">${(parseFloat(unitPriceHT) * data.quantity).toFixed(2)} € HT</td>
                </tr>
                ${discount ? `
                <tr style="background-color: #f0fdf4;">
                  <td colspan="3" style="padding: 10px 15px; font-size: 14px; color: #16a34a;">
                    🏷️ Code promo : <strong>${data.promoCode || 'Réduction'}</strong>
                  </td>
                  <td style="padding: 10px 15px; text-align: right; font-size: 14px; font-weight: 600; color: #16a34a;">-${(parseFloat(discount) / (1 + TVA_RATE)).toFixed(2)} € HT</td>
                </tr>
                ` : ''}
                <tr>
                  <td colspan="3" style="padding: 10px 15px; font-size: 14px; color: #71717a;">Total HT</td>
                  <td style="padding: 10px 15px; text-align: right; font-size: 14px;">${totalHT} €</td>
                </tr>
                <tr>
                  <td colspan="3" style="padding: 10px 15px; font-size: 14px; color: #71717a;">TVA 20%</td>
                  <td style="padding: 10px 15px; text-align: right; font-size: 14px;">${tvaAmount} €</td>
                </tr>
                <tr style="background-color: #18181b;">
                  <td colspan="3" style="padding: 15px; font-size: 16px; font-weight: 700; color: #ffffff;">TOTAL TTC</td>
                  <td style="padding: 15px; text-align: right; font-size: 20px; font-weight: 700; color: #22c55e;">${totalTTC} €</td>
                </tr>
              </table>
            </td>
          </tr>
          
          <!-- Actions rapides -->
          <tr>
            <td style="padding: 25px 30px; background-color: #f4f4f5; border-top: 1px solid #e4e4e7;">
              <h4 style="margin: 0 0 15px; font-size: 13px; color: #71717a; text-transform: uppercase;">⚡ Actions rapides</h4>
              <table cellpadding="0" cellspacing="0">
                <tr>
                  <td style="padding-right: 10px;">
                    <a href="https://www.rekaire.fr/admin" style="display: inline-block; padding: 12px 24px; background: #eb5122; color: #ffffff; text-decoration: none; border-radius: 6px; font-weight: 600; font-size: 14px;">
                      📦 Voir dans Admin
                    </a>
                  </td>
                  <td style="padding-right: 10px;">
                    <a href="https://dashboard.stripe.com/payments" style="display: inline-block; padding: 12px 24px; background: #6366f1; color: #ffffff; text-decoration: none; border-radius: 6px; font-weight: 600; font-size: 14px;">
                      💳 Stripe Dashboard
                    </a>
                  </td>
                  <td>
                    <a href="mailto:${data.customerEmail}?subject=Commande ${data.orderId} - Rekaire" style="display: inline-block; padding: 12px 24px; background: #18181b; color: #ffffff; text-decoration: none; border-radius: 6px; font-weight: 600; font-size: 14px;">
                      ✉️ Contacter
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="padding: 20px 30px; text-align: center; background-color: #18181b;">
              <p style="margin: 0; font-size: 12px; color: #71717a;">
                Email automatique Rekaire Admin • ${new Date().toLocaleString('fr-FR')}
              </p>
            </td>
          </tr>
          
        </table>
      </td>
    </tr>
  </table>
  
</body>
</html>
      `,
      text: `
══════════════════════════════════════════════════════════════════
🔔 NOUVELLE COMMANDE REKAIRE
══════════════════════════════════════════════════════════════════

Date: ${orderDate}

RÉSUMÉ
──────────────────────────────────────────────────────────────────
N° Commande: ${data.orderId}
Total TTC: ${totalTTC} €
Quantité: ${data.quantity} × RK01
Statut: ✓ Payé via Stripe

CLIENT
──────────────────────────────────────────────────────────────────
Nom: ${data.customerName || 'Non renseigné'}
Email: ${data.customerEmail}
Téléphone: ${data.customerPhone || 'Non renseigné'}
Réf. Stripe: ${data.stripePaymentId || 'N/A'}

${data.shippingAddress ? `ADRESSE DE LIVRAISON
──────────────────────────────────────────────────────────────────
${data.shippingAddress.name || data.customerName || ''}
${data.shippingAddress.line1 || ''}
${data.shippingAddress.line2 || ''}
${data.shippingAddress.postalCode || ''} ${data.shippingAddress.city || ''}
${data.shippingAddress.country || 'France'}
` : ''}

DÉTAIL FINANCIER
──────────────────────────────────────────────────────────────────
${data.productName} × ${data.quantity}
Prix unitaire HT: ${unitPriceHT} €
${discount ? `Code promo (${data.promoCode || ''}): -${(parseFloat(discount) / (1 + TVA_RATE)).toFixed(2)} € HT
` : ''}Total HT: ${totalHT} €
TVA 20%: ${tvaAmount} €
──────────────────────────────────────────────────────────────────
TOTAL TTC: ${totalTTC} €
──────────────────────────────────────────────────────────────────

→ Admin: https://www.rekaire.fr/admin
→ Stripe: https://dashboard.stripe.com/payments
→ Contacter: mailto:${data.customerEmail}

Email automatique • ${new Date().toLocaleString('fr-FR')}
      `,
    });

    return { success: true, data: result };
  } catch (error) {
    console.error("[Email] Failed to send admin notification:", error);
    return { success: false, error };
  }
}

// ============================================
// Email d'expédition avec numéro de suivi
// ============================================

export interface ShippingEmailData {
  customerEmail: string;
  customerName?: string;
  orderNumber: string;
  trackingNumber: string;
  trackingUrl: string;
  carrier: string;
}

export async function sendShippingEmail(data: ShippingEmailData) {
  try {
    const result = await resend.emails.send({
      from: `${FROM_NAME} <${FROM_EMAIL}>`,
      to: data.customerEmail,
      subject: `Votre commande ${data.orderNumber} a été expédiée !`,
      html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 40px 20px; }
    .header { text-align: center; margin-bottom: 40px; background: linear-gradient(135deg, #0a0a0a 0%, #1f1f1f 100%); padding: 30px; border-radius: 12px 12px 0 0; }
    .content { background: #f9f9f9; border-radius: 0 0 8px 8px; padding: 30px; margin-bottom: 30px; }
    h1 { color: #0A0A0A; margin: 0 0 20px; }
    .tracking-box { background: white; border: 2px solid #eb5122; border-radius: 8px; padding: 20px; text-align: center; margin: 20px 0; }
    .tracking-number { font-size: 20px; font-weight: bold; color: #eb5122; letter-spacing: 1px; margin: 10px 0; }
    .carrier { color: #666; font-size: 14px; }
    .footer { text-align: center; font-size: 12px; color: #999; margin-top: 40px; }
    .btn { display: inline-block; padding: 14px 28px; background: #eb5122; color: white; text-decoration: none; border-radius: 6px; margin-top: 15px; font-weight: bold; }
    .btn:hover { background: #d4471e; }
    .timeline { margin: 20px 0; padding: 0; }
    .timeline-item { display: flex; align-items: center; padding: 10px 0; }
    .timeline-dot { width: 12px; height: 12px; border-radius: 50%; margin-right: 15px; }
    .timeline-dot.done { background: #22c55e; }
    .timeline-dot.current { background: #eb5122; animation: pulse 1.5s infinite; }
    .timeline-dot.pending { background: #e5e7eb; }
    @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.5; } }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <img src="${COMPANY_INFO.logo}" alt="Rekaire" style="max-width: 180px; height: auto;" />
    </div>
    
    <div class="content">
      <h1>🎉 Votre commande est en route !</h1>
      <p>Bonjour${data.customerName ? ` ${data.customerName}` : ''}, bonne nouvelle !</p>
      <p>Votre commande <strong>${data.orderNumber}</strong> a été expédiée et est maintenant en chemin vers vous.</p>
      
      <div class="tracking-box">
        <div class="carrier">Transporteur : ${data.carrier}</div>
        <div class="tracking-number">${data.trackingNumber}</div>
        <a href="${data.trackingUrl}" class="btn" target="_blank">
          📍 Suivre mon colis
        </a>
      </div>
      
      <div class="timeline">
        <div class="timeline-item">
          <span class="timeline-dot done"></span>
          <span>Commande confirmée ✓</span>
        </div>
        <div class="timeline-item">
          <span class="timeline-dot done"></span>
          <span>Préparation terminée ✓</span>
        </div>
        <div class="timeline-item">
          <span class="timeline-dot current"></span>
          <span>En cours de livraison</span>
        </div>
        <div class="timeline-item">
          <span class="timeline-dot pending"></span>
          <span>Livré</span>
        </div>
      </div>
      
      <p style="font-size: 14px; color: #666; margin-top: 20px;">
        La livraison est généralement effectuée sous 2-4 jours ouvrés. 
        Vous recevrez une notification lors de la livraison.
      </p>
    </div>
    
    <p style="text-align: center;">
      Une question ? Contactez-nous à <a href="mailto:${FROM_EMAIL}">${FROM_EMAIL}</a>
    </p>
    
    <div class="footer">
      <p>${COMPANY_INFO.name} - ${COMPANY_INFO.address}, ${COMPANY_INFO.city}</p>
      <p>SIRET : ${COMPANY_INFO.siret} | TVA : ${COMPANY_INFO.tva}</p>
      <p>© ${new Date().getFullYear()} Rekaire. Tous droits réservés.</p>
    </div>
  </div>
</body>
</html>
      `,
      text: `
Votre commande ${data.orderNumber} a été expédiée !

Bonjour${data.customerName ? ` ${data.customerName}` : ''},

Votre commande est maintenant en route !

Transporteur : ${data.carrier}
Numéro de suivi : ${data.trackingNumber}

Suivez votre colis ici : ${data.trackingUrl}

La livraison est généralement effectuée sous 2-4 jours ouvrés.

Une question ? Contactez-nous à ${FROM_EMAIL}

© ${new Date().getFullYear()} Rekaire
      `,
    });

    console.log("[Email] Shipping notification sent to:", data.customerEmail);
    return { success: true, data: result };
  } catch (error) {
    console.error("[Email] Failed to send shipping notification:", error);
    return { success: false, error };
  }
}

// ============================================
// Email avec lien de facture PDF
// ============================================

export interface InvoiceEmailData {
  customerEmail: string;
  customerName?: string;
  orderNumber: string;
  invoiceNumber: string;
  invoiceUrl: string;
  totalTTC: number; // en euros
}

export async function sendInvoiceEmail(data: InvoiceEmailData) {
  const amount = data.totalTTC.toFixed(2);
  
  try {
    const result = await resend.emails.send({
      from: `${FROM_NAME} <${FROM_EMAIL}>`,
      to: data.customerEmail,
      subject: `📄 Facture ${data.invoiceNumber} - Commande ${data.orderNumber}`,
      html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 40px 20px; }
    .header { text-align: center; margin-bottom: 40px; }
    .logo { font-size: 24px; font-weight: bold; color: #0A0A0A; }
    .content { background: #f9f9f9; border-radius: 8px; padding: 30px; margin-bottom: 30px; }
    h1 { color: #0A0A0A; margin: 0 0 20px; }
    .invoice-box { background: white; border: 1px solid #e5e7eb; border-radius: 8px; padding: 20px; margin: 20px 0; }
    .footer { text-align: center; font-size: 12px; color: #999; margin-top: 40px; }
    .btn { display: inline-block; padding: 14px 28px; background: #eb5122; color: white; text-decoration: none; border-radius: 6px; margin-top: 15px; font-weight: bold; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="logo">REKAIRE</div>
    </div>
    
    <div class="content">
      <h1>Votre facture est disponible</h1>
      <p>Bonjour${data.customerName ? ` ${data.customerName}` : ''},</p>
      <p>Veuillez trouver ci-dessous votre facture pour la commande <strong>${data.orderNumber}</strong>.</p>
      
      <div class="invoice-box">
        <p><strong>Facture N°:</strong> ${data.invoiceNumber}</p>
        <p><strong>Commande:</strong> ${data.orderNumber}</p>
        <p><strong>Montant TTC:</strong> ${amount} €</p>
        
        <a href="${data.invoiceUrl}" class="btn" target="_blank">
          📥 Télécharger la facture PDF
        </a>
      </div>
      
      <p style="font-size: 14px; color: #666;">
        Ce lien est valable pendant 7 jours. Pour obtenir une nouvelle copie, contactez-nous.
      </p>
    </div>
    
    <p style="text-align: center;">
      Une question ? Contactez-nous à <a href="mailto:${FROM_EMAIL}">${FROM_EMAIL}</a>
    </p>
    
    <div class="footer">
      <p>© ${new Date().getFullYear()} Rekaire. Tous droits réservés.</p>
    </div>
  </div>
</body>
</html>
      `,
      text: `
Votre facture ${data.invoiceNumber}

Bonjour${data.customerName ? ` ${data.customerName}` : ''},

Votre facture pour la commande ${data.orderNumber} est disponible.

Facture N°: ${data.invoiceNumber}
Montant TTC: ${amount} €

Télécharger: ${data.invoiceUrl}

Ce lien est valable pendant 7 jours.

© ${new Date().getFullYear()} Rekaire
      `,
    });

    console.log("[Email] Invoice email sent to:", data.customerEmail);
    return { success: true, data: result };
  } catch (error) {
    console.error("[Email] Failed to send invoice email:", error);
    return { success: false, error };
  }
}
