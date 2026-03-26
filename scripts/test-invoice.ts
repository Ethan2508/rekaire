/**
 * Script de test : génère une facture PDF et optionnellement l'envoie par email
 * 
 * Usage: npx tsx scripts/test-invoice.ts
 * 
 * Avec email : RESEND_API_KEY=re_xxx npx tsx scripts/test-invoice.ts
 */

import { generateInvoicePDF } from '../src/lib/invoice';
import * as fs from 'fs';

const RESEND_API_KEY = process.env.RESEND_API_KEY;

async function main() {
  console.log('Génération de la facture de test...');

  const invoiceData = {
    invoiceNumber: 'FW-2026-TEST',
    orderNumber: 'RK-MN7H2BYO-TEST',
    date: new Date(),
    customer: {
      name: 'Noam Kalfa',
      email: 'noam.kalfa@hotmail.fr',
      phone: '06 12 34 56 78',
      address: {
        line1: '10 Rue de Test',
        postalCode: '75001',
        city: 'Paris',
        country: 'France',
      },
    },
    items: [{
      ref: 'RK01',
      description: 'Système autonome d\'extinction incendie',
      quantity: 2,
      unitPriceHT: 75,
      totalHT: 150,
    }],
    totalHT: 150,
    tvaRate: 0.20,
    tvaAmount: 30,
    totalTTC: 180,
    isPaid: true,
    paymentMethod: 'Carte bancaire (Stripe)',
  };

  const pdfBuffer = await generateInvoicePDF(invoiceData);
  
  // Sauvegarder en local pour vérif
  fs.writeFileSync('test-facture.pdf', pdfBuffer);
  console.log('PDF sauvegardé : test-facture.pdf');

  // Envoyer par email si clé dispo
  if (RESEND_API_KEY) {
    const { Resend } = await import('resend');
    const resend = new Resend(RESEND_API_KEY);
    console.log('Envoi à contact@rekaire.fr...');
    const result = await resend.emails.send({
      from: 'Rekaire <no-reply@rekaire.fr>',
      to: 'contact@rekaire.fr',
      subject: '🧪 TEST - Facture FW-2026-TEST (vérification format)',
      html: '<p>Voici une facture de test pour vérifier le nouveau format. Voir pièce jointe.</p>',
      attachments: [{
        filename: 'Facture-FW-2026-TEST.pdf',
        content: pdfBuffer.toString('base64'),
      }],
    });
    console.log('Email envoyé :', result);
  } else {
    console.log('Pas de RESEND_API_KEY → email non envoyé. Ouvre test-facture.pdf pour vérifier.');
  }
}

main().catch(console.error);
