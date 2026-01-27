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
