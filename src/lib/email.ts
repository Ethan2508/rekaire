// ============================================
// REKAIRE - Email Utilities (Resend)
// ============================================

import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

const FROM_EMAIL = process.env.EMAIL_FROM || "contact@rekaire.fr";
const FROM_NAME = "Rekaire";

export interface OrderEmailData {
  orderId: string;
  customerEmail: string;
  customerName?: string;
  productName: string;
  quantity: number;
  amountCents: number;
  currency: string;
  shippingAddress?: {
    line1?: string;
    line2?: string;
    city?: string;
    postalCode?: string;
    country?: string;
  };
}

// Email de confirmation de commande
export async function sendOrderConfirmationEmail(data: OrderEmailData) {
  const amount = (data.amountCents / 100).toFixed(2);
  
  try {
    const result = await resend.emails.send({
      from: `${FROM_NAME} <${FROM_EMAIL}>`,
      to: data.customerEmail,
      subject: `Confirmation de commande ${data.orderId}`,
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
    .order-number { font-size: 14px; color: #666; margin-bottom: 20px; }
    h1 { color: #0A0A0A; margin: 0 0 20px; }
    .item { display: flex; justify-content: space-between; padding: 15px 0; border-bottom: 1px solid #eee; }
    .total { display: flex; justify-content: space-between; padding: 20px 0; font-weight: bold; font-size: 18px; }
    .footer { text-align: center; font-size: 12px; color: #999; margin-top: 40px; }
    .btn { display: inline-block; padding: 12px 24px; background: #F97316; color: white; text-decoration: none; border-radius: 6px; margin-top: 20px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="logo">REKAIRE</div>
    </div>
    
    <div class="content">
      <div class="order-number">Commande ${data.orderId}</div>
      <h1>Merci pour votre commande !</h1>
      <p>Votre commande a été confirmée et sera expédiée dans les plus brefs délais.</p>
      
      <div class="item">
        <span>${data.productName} × ${data.quantity}</span>
        <span>${amount} €</span>
      </div>
      
      <div class="total">
        <span>Total</span>
        <span>${amount} €</span>
      </div>
      
      ${data.shippingAddress ? `
      <div style="margin-top: 20px; padding-top: 20px; border-top: 1px solid #eee;">
        <strong>Adresse de livraison :</strong><br>
        ${data.shippingAddress.line1 || ""}<br>
        ${data.shippingAddress.line2 ? data.shippingAddress.line2 + "<br>" : ""}
        ${data.shippingAddress.postalCode || ""} ${data.shippingAddress.city || ""}<br>
        ${data.shippingAddress.country || "France"}
      </div>
      ` : ""}
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
Commande ${data.orderId}

Merci pour votre commande !

${data.productName} × ${data.quantity} : ${amount} €

Total : ${amount} €

Une question ? Contactez-nous à ${FROM_EMAIL}

© ${new Date().getFullYear()} Rekaire
      `,
    });

    return { success: true, data: result };
  } catch (error) {
    console.error("[Email] Failed to send confirmation:", error);
    return { success: false, error };
  }
}

// Email de notification admin (optionnel)
export async function sendAdminNotificationEmail(data: OrderEmailData) {
  const adminEmail = process.env.ADMIN_EMAIL || "admin@rekaire.fr";
  const amount = (data.amountCents / 100).toFixed(2);

  try {
    const result = await resend.emails.send({
      from: `${FROM_NAME} <${FROM_EMAIL}>`,
      to: adminEmail,
      subject: `🔔 Nouvelle commande ${data.orderId}`,
      html: `
        <h2>Nouvelle commande !</h2>
        <p><strong>ID:</strong> ${data.orderId}</p>
        <p><strong>Client:</strong> ${data.customerEmail}</p>
        <p><strong>Produit:</strong> ${data.productName} × ${data.quantity}</p>
        <p><strong>Montant:</strong> ${amount} €</p>
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
      subject: `📦 Votre commande ${data.orderNumber} a été expédiée !`,
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
      <div class="logo">REKAIRE</div>
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
      <p>© ${new Date().getFullYear()} Rekaire. Tous droits réservés.</p>
      <p>Protection incendie intelligente</p>
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
