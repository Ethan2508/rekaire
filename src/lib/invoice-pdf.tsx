// ============================================
// REKAIRE - Génération de Facture PDF
// Template 100% français avec mentions légales
// ============================================

import React from 'react';
import {
  Document,
  Page,
  Text,
  View,
  Image,
  StyleSheet,
  Font,
  renderToBuffer,
} from '@react-pdf/renderer';
import { siteConfig } from '@/config/site';

// ============================================
// TYPES
// ============================================

export interface InvoiceData {
  // Numéro et dates
  invoiceNumber: string;
  invoiceDate: Date;
  orderId: string;
  
  // Client (facturation)
  customer: {
    name: string;
    company?: string;
    address: string;
    postalCode: string;
    city: string;
    country?: string;
    email: string;
    phone?: string;
    vatNumber?: string; // Numéro TVA intracommunautaire
  };
  
  // Produits
  items: {
    ref: string; // RK01
    description: string;
    shippingAddress?: string; // Adresse de livraison
    quantity: number;
    unitPriceHT: number; // En centimes
    totalHT: number; // En centimes
  }[];
  
  // Totaux
  subtotalHT: number; // En centimes
  discountHT?: number; // Réduction HT en centimes
  discountCode?: string;
  totalHT: number; // Après réduction, en centimes
  vatRate: number; // Ex: 20 pour 20%
  vatAmount: number; // En centimes
  totalTTC: number; // En centimes
  
  // Paiement
  paymentMethod: string;
  paymentDate: Date;
  stripePaymentId?: string;
}

// ============================================
// STYLES
// ============================================

const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontSize: 10,
    fontFamily: 'Helvetica',
    color: '#1a1a1a',
  },
  // Header
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 30,
  },
  companyInfo: {
    width: '50%',
  },
  logo: {
    width: 120,
    height: 'auto',
    marginBottom: 10,
  },
  companySubname: {
    fontSize: 10,
    color: '#666',
    marginBottom: 10,
  },
  companyDetails: {
    fontSize: 9,
    color: '#444',
    lineHeight: 1.5,
  },
  invoiceInfo: {
    width: '40%',
    textAlign: 'right',
  },
  invoiceTitle: {
    fontSize: 20,
    fontFamily: 'Helvetica-Bold',
    marginBottom: 10,
  },
  invoiceNumber: {
    fontSize: 11,
    fontFamily: 'Helvetica-Bold',
    marginBottom: 4,
  },
  invoiceDate: {
    fontSize: 10,
    color: '#444',
  },
  
  // Client
  clientSection: {
    marginBottom: 25,
    padding: 15,
    backgroundColor: '#f8f8f8',
    borderRadius: 4,
  },
  clientTitle: {
    fontSize: 10,
    fontFamily: 'Helvetica-Bold',
    textTransform: 'uppercase',
    color: '#666',
    marginBottom: 8,
  },
  clientName: {
    fontSize: 12,
    fontFamily: 'Helvetica-Bold',
    marginBottom: 4,
  },
  clientDetails: {
    fontSize: 10,
    color: '#333',
    lineHeight: 1.4,
  },
  
  // Table
  table: {
    marginBottom: 20,
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#f97316', // Orange Rekaire
    color: '#fff',
    padding: 10,
    fontSize: 9,
    fontFamily: 'Helvetica-Bold',
    textTransform: 'uppercase',
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e5e5',
    padding: 10,
    fontSize: 10,
  },
  tableRowAlt: {
    backgroundColor: '#fafafa',
  },
  colRef: { width: '12%' },
  colDescription: { width: '38%' },
  colUnitPrice: { width: '18%', textAlign: 'right' },
  colQuantity: { width: '12%', textAlign: 'center' },
  colTotal: { width: '20%', textAlign: 'right' },
  
  // Totaux
  totalsSection: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginBottom: 25,
  },
  totalsBox: {
    width: '45%',
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e5e5',
  },
  totalRowFinal: {
    backgroundColor: '#f97316', // Orange Rekaire
    color: '#fff',
    fontFamily: 'Helvetica-Bold',
    fontSize: 12,
  },
  totalLabel: {
    fontSize: 10,
  },
  totalValue: {
    fontSize: 10,
    fontFamily: 'Helvetica-Bold',
  },
  discountRow: {
    color: '#059669', // Vert pour la réduction
  },
  
  // Paiement
  paymentSection: {
    marginBottom: 25,
    padding: 12,
    backgroundColor: '#ecfdf5', // Vert clair
    borderRadius: 4,
    borderLeftWidth: 3,
    borderLeftColor: '#059669',
  },
  paymentTitle: {
    fontSize: 10,
    fontFamily: 'Helvetica-Bold',
    color: '#059669',
    marginBottom: 4,
  },
  paymentDetails: {
    fontSize: 9,
    color: '#333',
  },
  
  // Footer
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 40,
    right: 40,
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: '#e5e5e5',
  },
  legalText: {
    fontSize: 7,
    color: '#666',
    textAlign: 'center',
    lineHeight: 1.5,
    marginBottom: 4,
  },
  legalBold: {
    fontFamily: 'Helvetica-Bold',
  },
});

// ============================================
// HELPERS
// ============================================

function formatPrice(cents: number): string {
  return (cents / 100).toFixed(2).replace('.', ',') + ' €';
}

function formatDate(date: Date): string {
  return date.toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });
}

// ============================================
// COMPOSANT FACTURE
// ============================================

export const InvoiceDocument: React.FC<{ data: InvoiceData }> = ({ data }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.companyInfo}>
          <Image style={styles.logo} src={`${siteConfig.url}/images/logo.png`} />
          <Text style={styles.companyDetails}>
            5 Rue Mazenod{'\n'}
            69003 LYON{'\n'}
            France{'\n'}
            {'\n'}
            SIRET : 989 603 907 00019{'\n'}
            TVA Intracomm. : FR51989603907{'\n'}
            contact@rekaire.fr
          </Text>
        </View>
        
        <View style={styles.invoiceInfo}>
          <Text style={styles.invoiceTitle}>FACTURE</Text>
          <Text style={styles.invoiceNumber}>N° {data.invoiceNumber}</Text>
          <Text style={styles.invoiceDate}>
            Date : {formatDate(data.invoiceDate)}{'\n'}
            Commande : {data.orderId}
          </Text>
        </View>
      </View>

      {/* Client */}
      <View style={styles.clientSection}>
        <Text style={styles.clientTitle}>Facturer à</Text>
        <Text style={styles.clientName}>
          {data.customer.company || data.customer.name}
        </Text>
        <Text style={styles.clientDetails}>
          {data.customer.company && `${data.customer.name}\n`}
          {data.customer.address}{'\n'}
          {data.customer.postalCode} {data.customer.city}{'\n'}
          {data.customer.country || 'France'}{'\n'}
          {data.customer.email}
          {data.customer.phone && `\nTél : ${data.customer.phone}`}
          {data.customer.vatNumber && `\nN° TVA : ${data.customer.vatNumber}`}
        </Text>
      </View>

      {/* Table des produits */}
      <View style={styles.table}>
        <View style={styles.tableHeader}>
          <Text style={styles.colRef}>Réf.</Text>
          <Text style={styles.colDescription}>Désignation</Text>
          <Text style={styles.colUnitPrice}>Prix unit. HT</Text>
          <Text style={styles.colQuantity}>Qté</Text>
          <Text style={styles.colTotal}>Total HT</Text>
        </View>
        
        {data.items.map((item, index) => (
          <View 
            key={index} 
            style={[styles.tableRow, ...(index % 2 === 1 ? [styles.tableRowAlt] : [])]}
          >
            <Text style={styles.colRef}>{item.ref}</Text>
            <Text style={styles.colDescription}>
              {item.description}
              {item.shippingAddress && `\n- Adresse de livraison : ${item.shippingAddress}`}
            </Text>
            <Text style={styles.colUnitPrice}>{formatPrice(item.unitPriceHT)}</Text>
            <Text style={styles.colQuantity}>{item.quantity}</Text>
            <Text style={styles.colTotal}>{formatPrice(item.totalHT)}</Text>
          </View>
        ))}
      </View>

      {/* Totaux */}
      <View style={styles.totalsSection}>
        <View style={styles.totalsBox}>
          {data.discountHT && data.discountHT > 0 && (
            <View style={[styles.totalRow, styles.discountRow]}>
              <Text style={styles.totalLabel}>
                Réduction{data.discountCode ? ` (${data.discountCode})` : ''}
              </Text>
              <Text style={styles.totalValue}>-{formatPrice(data.discountHT)}</Text>
            </View>
          )}
          
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Total HT</Text>
            <Text style={styles.totalValue}>{formatPrice(data.totalHT)}</Text>
          </View>
          
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>TVA ({data.vatRate}%)</Text>
            <Text style={styles.totalValue}>{formatPrice(data.vatAmount)}</Text>
          </View>
          
          <View style={[styles.totalRow, styles.totalRowFinal]}>
            <Text style={styles.totalLabel}>Total TTC</Text>
            <Text style={styles.totalValue}>{formatPrice(data.totalTTC)}</Text>
          </View>
        </View>
      </View>

      {/* Paiement */}
      <View style={styles.paymentSection}>
        <Text style={styles.paymentTitle}>✓ Paiement reçu</Text>
        <Text style={styles.paymentDetails}>
          Mode de paiement : {data.paymentMethod}{'\n'}
          Date du paiement : {formatDate(data.paymentDate)}
          {data.stripePaymentId && `\nRéférence : ${data.stripePaymentId}`}
        </Text>
      </View>

      {/* Footer avec mentions légales */}
      <View style={styles.footer}>
        <Text style={styles.legalText}>
          Nelior - SAS, société par actions simplifiée au capital de 1 260,00 €
        </Text>
        <Text style={styles.legalText}>
          N° Siret : 98960390700019 - R.C.S. Lyon 989603907 - Code APE : 46.69C - TVA intracommunautaire : FR51989603907 - Option de TVA sur les débits
        </Text>
      </View>
    </Page>
  </Document>
);

// ============================================
// GÉNÉRATION DU PDF
// ============================================

/**
 * Génère le buffer PDF de la facture
 */
export async function generateInvoicePDF(data: InvoiceData): Promise<Buffer> {
  const buffer = await renderToBuffer(<InvoiceDocument data={data} />);
  return Buffer.from(buffer);
}

/**
 * Génère le PDF en base64 (pour pièce jointe email)
 */
export async function generateInvoicePDFBase64(data: InvoiceData): Promise<string> {
  const buffer = await generateInvoicePDF(data);
  return buffer.toString('base64');
}
