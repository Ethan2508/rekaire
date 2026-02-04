// ============================================
// REKAIRE - Invoice PDF Generator
// Utilise @react-pdf/renderer
// ============================================

import { Document, Page, Text, View, StyleSheet, renderToBuffer } from '@react-pdf/renderer';
import React from 'react';

// Styles pour le PDF
const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontSize: 10,
    fontFamily: 'Helvetica',
    backgroundColor: '#ffffff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 30,
    paddingBottom: 20,
    borderBottomWidth: 2,
    borderBottomColor: '#eb5122',
  },
  logo: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#eb5122',
    letterSpacing: 2,
  },
  logoSubtitle: {
    fontSize: 9,
    color: '#666',
    marginTop: 4,
  },
  invoiceTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'right',
  },
  invoiceNumber: {
    fontSize: 12,
    color: '#666',
    textAlign: 'right',
    marginTop: 4,
  },
  invoiceDate: {
    fontSize: 10,
    color: '#666',
    textAlign: 'right',
    marginTop: 2,
  },
  twoColumns: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 30,
  },
  column: {
    width: '45%',
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
    paddingBottom: 4,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  companyName: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  text: {
    fontSize: 10,
    color: '#555',
    marginBottom: 2,
    lineHeight: 1.4,
  },
  textWithMargin: {
    fontSize: 10,
    color: '#555',
    marginBottom: 2,
    lineHeight: 1.4,
    marginTop: 8,
  },
  table: {
    marginTop: 20,
    marginBottom: 20,
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#eb5122',
    paddingVertical: 10,
    paddingHorizontal: 8,
  },
  tableHeaderText: {
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: 10,
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    paddingVertical: 12,
    paddingHorizontal: 8,
  },
  tableRowAlt: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    paddingVertical: 12,
    paddingHorizontal: 8,
    backgroundColor: '#f9f9f9',
  },
  colDescription: {
    width: '45%',
  },
  colQty: {
    width: '10%',
    textAlign: 'center',
  },
  colUnit: {
    width: '20%',
    textAlign: 'right',
  },
  colTotal: {
    width: '25%',
    textAlign: 'right',
  },
  totalsContainer: {
    marginLeft: 'auto',
    width: '40%',
    marginTop: 20,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  totalRowFinal: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    backgroundColor: '#eb5122',
    paddingHorizontal: 10,
    marginTop: 8,
  },
  totalLabel: {
    fontSize: 10,
    color: '#333',
  },
  totalValue: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#333',
  },
  totalValueGreen: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#2e7d32',
  },
  totalLabelFinal: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  totalValueFinal: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  footer: {
    position: 'absolute',
    bottom: 40,
    left: 40,
    right: 40,
  },
  footerLine: {
    borderTopWidth: 1,
    borderTopColor: '#ddd',
    paddingTop: 15,
  },
  footerText: {
    fontSize: 8,
    color: '#888',
    textAlign: 'center',
    lineHeight: 1.5,
  },
  badge: {
    backgroundColor: '#e8f5e9',
    color: '#2e7d32',
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 4,
    fontSize: 9,
    marginTop: 10,
    alignSelf: 'flex-end',
  },
  badgeContainer: {
    marginTop: 20,
    alignItems: 'flex-end',
  },
  orderNumber: {
    fontSize: 9,
    color: '#666',
    marginTop: 15,
  },
  tableHeaderDesc: {
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: 10,
    width: '45%',
  },
  tableHeaderQty: {
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: 10,
    width: '10%',
    textAlign: 'center',
  },
  tableHeaderUnit: {
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: 10,
    width: '20%',
    textAlign: 'right',
  },
  tableHeaderTotal: {
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: 10,
    width: '25%',
    textAlign: 'right',
  },
});

// Informations de l'entreprise NELIOR
const COMPANY_INFO = {
  name: 'NELIOR',
  address: '123 Rue de l\'Innovation',
  postalCode: '75001',
  city: 'Paris',
  country: 'France',
  siret: '123 456 789 00012',
  tva: 'FR12345678901',
  email: 'contact@rekaire.fr',
  phone: '+33 1 23 45 67 89',
  website: 'www.rekaire.fr',
};

export interface InvoiceData {
  invoiceNumber: string;
  orderNumber: string;
  date: Date;
  customer: {
    name: string;
    email: string;
    phone?: string;
    company?: string;
    address: {
      line1: string;
      line2?: string;
      postalCode: string;
      city: string;
      country: string;
    };
  };
  items: Array<{
    description: string;
    quantity: number;
    unitPriceHT: number;
    totalHT: number;
  }>;
  promoCode?: string;
  promoDiscount?: number;
  totalHT: number;
  tvaRate: number;
  tvaAmount: number;
  totalTTC: number;
  isPaid: boolean;
  paymentMethod: string;
}

// Formatage des montants
const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR',
  }).format(amount);
};

// Formatage des dates
const formatDate = (date: Date): string => {
  return new Intl.DateTimeFormat('fr-FR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(date);
};

// Composant Document PDF
const InvoiceDocument: React.FC<{ data: InvoiceData }> = ({ data }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.logo}>REKAIRE</Text>
          <Text style={styles.logoSubtitle}>Protection incendie intelligente</Text>
        </View>
        <View>
          <Text style={styles.invoiceTitle}>FACTURE</Text>
          <Text style={styles.invoiceNumber}>N° {data.invoiceNumber}</Text>
          <Text style={styles.invoiceDate}>Date: {formatDate(data.date)}</Text>
        </View>
      </View>

      {/* Two columns: Company & Customer */}
      <View style={styles.twoColumns}>
        {/* Company info */}
        <View style={styles.column}>
          <Text style={styles.sectionTitle}>ÉMETTEUR</Text>
          <Text style={styles.companyName}>{COMPANY_INFO.name}</Text>
          <Text style={styles.text}>{COMPANY_INFO.address}</Text>
          <Text style={styles.text}>{COMPANY_INFO.postalCode} {COMPANY_INFO.city}</Text>
          <Text style={styles.text}>{COMPANY_INFO.country}</Text>
          <Text style={styles.textWithMargin}>SIRET: {COMPANY_INFO.siret}</Text>
          <Text style={styles.text}>TVA: {COMPANY_INFO.tva}</Text>
          <Text style={styles.text}>Email: {COMPANY_INFO.email}</Text>
        </View>
        {/* Customer info */}
        <View style={styles.column}>
          <Text style={styles.sectionTitle}>DESTINATAIRE</Text>
          <Text style={styles.companyName}>{data.customer.name}</Text>
          {data.customer.company && <Text style={styles.text}>{data.customer.company}</Text>}
          <Text style={styles.text}>{data.customer.address.line1}</Text>
          {data.customer.address.line2 && <Text style={styles.text}>{data.customer.address.line2}</Text>}
          <Text style={styles.text}>{data.customer.address.postalCode} {data.customer.address.city}</Text>
          <Text style={styles.text}>{data.customer.address.country}</Text>
          <Text style={styles.textWithMargin}>Email: {data.customer.email}</Text>
          {data.customer.phone && <Text style={styles.text}>Tél: {data.customer.phone}</Text>}
        </View>
      </View>

      {/* Order reference */}
      <Text style={styles.orderNumber}>Référence commande: {data.orderNumber}</Text>

      {/* Table */}
      <View style={styles.table}>
        {/* Header */}
        <View style={styles.tableHeader}>
          <Text style={styles.tableHeaderDesc}>DESCRIPTION</Text>
          <Text style={styles.tableHeaderQty}>QTÉ</Text>
          <Text style={styles.tableHeaderUnit}>PRIX UNIT. HT</Text>
          <Text style={styles.tableHeaderTotal}>TOTAL HT</Text>
        </View>
        {/* Items */}
        {data.items.map((item, index) => (
          <View key={index} style={index % 2 === 1 ? styles.tableRowAlt : styles.tableRow}>
            <Text style={styles.colDescription}>{item.description}</Text>
            <Text style={styles.colQty}>{item.quantity.toString()}</Text>
            <Text style={styles.colUnit}>{formatCurrency(item.unitPriceHT)}</Text>
            <Text style={styles.colTotal}>{formatCurrency(item.totalHT)}</Text>
          </View>
        ))}
      </View>

      {/* Totals */}
      <View style={styles.totalsContainer}>
        <View style={styles.totalRow}>
          <Text style={styles.totalLabel}>Sous-total HT</Text>
          <Text style={styles.totalValue}>{formatCurrency(data.totalHT + (data.promoDiscount || 0))}</Text>
        </View>
        {data.promoCode && data.promoDiscount && (
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Remise ({data.promoCode})</Text>
            <Text style={styles.totalValueGreen}>-{formatCurrency(data.promoDiscount)}</Text>
          </View>
        )}
        <View style={styles.totalRow}>
          <Text style={styles.totalLabel}>Total HT</Text>
          <Text style={styles.totalValue}>{formatCurrency(data.totalHT)}</Text>
        </View>
        <View style={styles.totalRow}>
          <Text style={styles.totalLabel}>TVA ({(data.tvaRate * 100).toFixed(0)}%)</Text>
          <Text style={styles.totalValue}>{formatCurrency(data.tvaAmount)}</Text>
        </View>
        <View style={styles.totalRowFinal}>
          <Text style={styles.totalLabelFinal}>TOTAL TTC</Text>
          <Text style={styles.totalValueFinal}>{formatCurrency(data.totalTTC)}</Text>
        </View>
      </View>

      {/* Payment status */}
      {data.isPaid && (
        <View style={styles.badgeContainer}>
          <Text style={styles.badge}>✓ PAYÉE - {data.paymentMethod}</Text>
        </View>
      )}

      {/* Footer */}
      <View style={styles.footer}>
        <View style={styles.footerLine}>
          <Text style={styles.footerText}>
            {COMPANY_INFO.name} - {COMPANY_INFO.address}, {COMPANY_INFO.postalCode} {COMPANY_INFO.city}{'\n'}
            SIRET: {COMPANY_INFO.siret} | N° TVA: {COMPANY_INFO.tva}{'\n'}
            {COMPANY_INFO.website} | {COMPANY_INFO.email}
          </Text>
        </View>
      </View>
    </Page>
  </Document>
);

/**
 * Génère un PDF de facture et retourne le buffer
 */
export async function generateInvoicePDF(data: InvoiceData): Promise<Buffer> {
  const buffer = await renderToBuffer(<InvoiceDocument data={data} />);
  return Buffer.from(buffer);
}

/**
 * Génère le nom de fichier pour une facture
 */
export function getInvoiceFileName(invoiceNumber: string): string {
  return `facture-${invoiceNumber.replace(/\//g, '-')}.pdf`;
}
