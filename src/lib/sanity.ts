// ============================================
// REKAIRE - Sanity Client Configuration
// ============================================

import { createClient } from '@sanity/client'
import { createImageUrlBuilder } from '@sanity/image-url'

// Configuration Sanity
export const sanityConfig = {
  projectId: '4dwntvw6',
  dataset: 'production',
  apiVersion: '2024-01-26',
  useCdn: false, // Désactivé pour éviter les erreurs en dev
}

// Client Sanity (lecture seule, avec CDN)
export const sanityClient = createClient(sanityConfig)

// Client Sanity pour mutations (avec token)
export const sanityWriteClient = createClient({
  ...sanityConfig,
  useCdn: false,
  token: process.env.SANITY_API_TOKEN,
})

// Builder d'URL pour les images
const builder = createImageUrlBuilder(sanityClient)

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function urlFor(source: any) {
  return builder.image(source)
}

// ============================================
// QUERIES GROQ
// ============================================

// Récupérer un produit par slug
export const getProductBySlug = async (slug: string) => {
  return sanityClient.fetch(
    `*[_type == "product" && slug.current == $slug && active == true][0]{
      _id,
      name,
      slug,
      shortDescription,
      description,
      priceHT,
      bulkPriceHT,
      bulkMinQuantity,
      tvaRate,
      images,
      specifications,
      features,
      stripePriceId,
      stock
    }`,
    { slug }
  )
}

// Récupérer tous les produits actifs
export const getAllProducts = async () => {
  return sanityClient.fetch(
    `*[_type == "product" && active == true] | order(name asc){
      _id,
      name,
      slug,
      shortDescription,
      priceHT,
      bulkPriceHT,
      images[0],
      stock
    }`
  )
}

// Récupérer les articles de blog
export const getArticles = async (limit?: number) => {
  const limitClause = limit ? `[0...${limit}]` : ''
  return sanityClient.fetch(
    `*[_type == "article" && status == "published"] | order(publishedAt desc)${limitClause}{
      _id,
      title,
      slug,
      excerpt,
      featuredImage,
      category,
      author,
      readTime,
      publishedAt,
      featured
    }`
  )
}

// Récupérer un article par slug
export const getArticleBySlug = async (slug: string) => {
  return sanityClient.fetch(
    `*[_type == "article" && slug.current == $slug && status == "published"][0]{
      _id,
      title,
      slug,
      excerpt,
      content,
      featuredImage,
      category,
      author,
      readTime,
      publishedAt
    }`,
    { slug }
  )
}

// Récupérer les FAQs par catégorie
export const getFAQs = async (category?: string) => {
  const filter = category 
    ? `*[_type == "faq" && active == true && category == $category]`
    : `*[_type == "faq" && active == true]`
  
  return sanityClient.fetch(
    `${filter} | order(order asc){
      _id,
      question,
      answer,
      category
    }`,
    category ? { category } : {}
  )
}

// Récupérer les partenaires
export const getPartners = async () => {
  return sanityClient.fetch(
    `*[_type == "partner" && active == true] | order(order asc){
      _id,
      name,
      logo,
      url,
      size
    }`
  )
}

// Récupérer les paramètres du site
export const getSiteSettings = async () => {
  return sanityClient.fetch(
    `*[_type == "siteSettings"][0]{
      siteName,
      tagline,
      logo,
      contact,
      social,
      fireStats,
      shipping,
      promotion
    }`
  )
}

// ============================================
// MUTATIONS (Écriture)
// ============================================

// Types pour les commandes
export interface OrderItem {
  productName: string
  productId?: string
  quantity: number
  unitPriceHT: number
  totalHT: number
}

export interface OrderCustomer {
  email: string
  firstName?: string
  lastName?: string
  phone?: string
  company?: string
}

export interface OrderAddress {
  line1: string
  line2?: string
  postalCode: string
  city: string
  country: string
}

export interface CreateOrderData {
  orderNumber: string
  items: OrderItem[]
  subtotalHT: number
  tvaAmount: number
  shippingCost: number
  discountAmount?: number
  discountCode?: string
  totalTTC: number
  customer: OrderCustomer
  shippingAddress?: OrderAddress
  billingAddress?: OrderAddress & { sameAsShipping?: boolean }
  shippingMethod: 'standard' | 'express' | 'relay'
  estimatedDelivery?: string
  stripeSessionId: string
  stripePaymentIntentId?: string
  stripeCustomerId?: string
  paymentMethod?: string
  invoiceUrl?: string
  receiptUrl?: string
  source?: 'website' | 'phone' | 'email' | 'b2b'
}

// Créer une commande
export const createOrder = async (data: CreateOrderData) => {
  const now = new Date().toISOString()
  
  const order = {
    _type: 'order',
    orderNumber: data.orderNumber,
    createdAt: now,
    status: 'paid',
    items: data.items.map((item, index) => ({
      _key: `item-${index}`,
      ...item,
    })),
    subtotalHT: data.subtotalHT,
    tvaAmount: data.tvaAmount,
    shippingCost: data.shippingCost,
    discountAmount: data.discountAmount || 0,
    discountCode: data.discountCode,
    totalTTC: data.totalTTC,
    customer: data.customer,
    shippingAddress: data.shippingAddress,
    billingAddress: data.billingAddress || { sameAsShipping: true },
    shippingMethod: data.shippingMethod,
    estimatedDelivery: data.estimatedDelivery,
    stripeSessionId: data.stripeSessionId,
    stripePaymentIntentId: data.stripePaymentIntentId,
    stripeCustomerId: data.stripeCustomerId,
    paymentMethod: data.paymentMethod || 'card',
    paidAt: now,
    invoiceUrl: data.invoiceUrl,
    receiptUrl: data.receiptUrl,
    source: data.source || 'website',
    history: [
      {
        _key: 'h1',
        date: now,
        action: 'Commande créée',
        details: 'Paiement confirmé via Stripe',
      },
    ],
  }

  return sanityWriteClient.create(order)
}

// Mettre à jour le statut d'une commande
export const updateOrderStatus = async (
  orderId: string,
  status: string,
  details?: { trackingNumber?: string; trackingUrl?: string }
) => {
  const now = new Date().toISOString()
  const patch = sanityWriteClient.patch(orderId).set({ status })

  // Ajouter les infos de suivi si fournies
  if (details?.trackingNumber) {
    patch.set({ trackingNumber: details.trackingNumber })
  }
  if (details?.trackingUrl) {
    patch.set({ trackingUrl: details.trackingUrl })
  }

  // Mettre à jour les dates selon le statut
  if (status === 'shipped') {
    patch.set({ shippedAt: now })
  } else if (status === 'delivered') {
    patch.set({ deliveredAt: now })
  }

  // Ajouter à l'historique
  const historyEntry = {
    _key: `h-${Date.now()}`,
    date: now,
    action: `Statut changé: ${status}`,
    details: details?.trackingNumber ? `N° suivi: ${details.trackingNumber}` : undefined,
  }

  patch.append('history', [historyEntry])

  return patch.commit()
}

// Créer ou mettre à jour un client
export const upsertCustomer = async (data: {
  email: string
  firstName?: string
  lastName?: string
  phone?: string
  company?: string
  stripeCustomerId?: string
  shippingAddress?: OrderAddress
  orderAmount?: number
}) => {
  const now = new Date().toISOString()

  // Chercher si le client existe déjà
  const existingCustomer = await sanityClient.fetch(
    `*[_type == "customer" && email == $email][0]{ _id, totalOrders, totalSpent }`,
    { email: data.email }
  )

  if (existingCustomer) {
    // Mettre à jour le client existant
    const newTotalOrders = (existingCustomer.totalOrders || 0) + 1
    const newTotalSpent = (existingCustomer.totalSpent || 0) + (data.orderAmount || 0)

    return sanityWriteClient
      .patch(existingCustomer._id)
      .set({
        firstName: data.firstName,
        lastName: data.lastName,
        phone: data.phone,
        company: data.company,
        stripeCustomerId: data.stripeCustomerId,
        defaultShippingAddress: data.shippingAddress,
        totalOrders: newTotalOrders,
        totalSpent: newTotalSpent,
        averageOrderValue: newTotalSpent / newTotalOrders,
        lastOrderAt: now,
        updatedAt: now,
      })
      .commit()
  } else {
    // Créer un nouveau client
    return sanityWriteClient.create({
      _type: 'customer',
      email: data.email,
      firstName: data.firstName,
      lastName: data.lastName,
      phone: data.phone,
      company: data.company,
      stripeCustomerId: data.stripeCustomerId,
      customerType: data.company ? 'business' : 'individual',
      defaultShippingAddress: data.shippingAddress,
      totalOrders: 1,
      totalSpent: data.orderAmount || 0,
      averageOrderValue: data.orderAmount || 0,
      firstOrderAt: now,
      lastOrderAt: now,
      createdAt: now,
      updatedAt: now,
    })
  }
}

// Récupérer une commande par numéro
export const getOrderByNumber = async (orderNumber: string) => {
  return sanityClient.fetch(
    `*[_type == "order" && orderNumber == $orderNumber][0]`,
    { orderNumber }
  )
}

// Récupérer les commandes d'un client
export const getCustomerOrders = async (email: string) => {
  return sanityClient.fetch(
    `*[_type == "order" && customer.email == $email] | order(createdAt desc){
      _id,
      orderNumber,
      createdAt,
      status,
      totalTTC,
      items,
      trackingNumber,
      trackingUrl
    }`,
    { email }
  )
}
