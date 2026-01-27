# 🔧 Guide d'Administration Rekaire

## 📋 Table des matières
1. [Gérer les Prix](#-gérer-les-prix)
2. [Ajouter des Images](#-ajouter-des-images)
3. [Modifier les Partenaires](#-modifier-les-partenaires)
4. [Gérer les Statistiques](#-gérer-les-statistiques)
5. [Configurer Stripe](#-configurer-stripe)
6. [Déploiement](#-déploiement)

---

## 💰 Gérer les Prix

### Fichier de configuration : `src/config/admin.ts`

```typescript
pricing: {
  singleHT: 70,        // Prix unitaire HT → Modifier ici
  bulkHT: 60,          // Prix lot HT → Modifier ici  
  bulkMinQuantity: 2,  // Quantité minimum pour le prix lot
  tvaRate: 20,         // Taux TVA
},
```

### Étapes pour modifier un prix :

1. Ouvrir `src/config/admin.ts`
2. Modifier les valeurs dans `pricing`
3. Sauvegarder le fichier
4. Redéployer le site

### ⚠️ Important : Synchroniser avec Stripe

Après avoir modifié les prix, vous devez aussi les mettre à jour dans Stripe :

1. Aller sur [dashboard.stripe.com](https://dashboard.stripe.com)
2. Produits → Votre produit → Modifier le prix
3. OU créer un nouveau prix et mettre à jour l'ID dans `stripe.singlePriceId`

---

## 🖼️ Ajouter des Images

### Images Produit

1. Placer les images dans : `public/images/product/gallery/`
2. Formats acceptés : `.png`, `.jpg`, `.webp`
3. Modifier le tableau `images` dans `src/config/admin.ts` :

```typescript
images: [
  { src: "/images/product/gallery/nouvelle-image.png", alt: "Description" },
  // ... autres images
],
```

### Images Partenaires

1. Placer le logo dans : `public/images/partners/`
2. Ajouter dans le tableau `partners` :

```typescript
partners: [
  { name: "Nouveau Partenaire", logo: "/images/partners/logo.png", size: "normal", active: true },
],
```

---

## 🤝 Modifier les Partenaires

### Dans `src/config/admin.ts` :

```typescript
partners: [
  { 
    name: "Synexium",                           // Nom
    logo: "/images/partners/synexium.png",      // Chemin logo
    size: "large",                              // "large" ou "normal"
    active: true                                // true = visible, false = masqué
  },
],
```

### Tailles disponibles :
- `"large"` : Affichage plus grand (h-20 md:h-28)
- `"normal"` : Affichage standard (h-16 md:h-20)

---

## 📊 Gérer les Statistiques

### Statistiques incendies affichées sur le site :

```typescript
fireStats: {
  domesticFires: 300000,           // "300 000 incendies domestiques"
  electricalPercentage: "25-30%",  // "25-30% d'origine électrique"
  injuries: 10000,                 // "~10 000 blessés"
  deaths: 500,                     // "500+ décès"
  nightPercentage: 70,             // "70% la nuit"
  businessClosure: 75,             // "75% entreprises cessent activité"
},
```

---

## 💳 Configurer Stripe

### 1. Créer un compte Stripe
Aller sur [stripe.com](https://stripe.com) et créer un compte.

### 2. Récupérer les clés API

Dans le Dashboard Stripe → Développeurs → Clés API :
- `Clé publiable` → `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
- `Clé secrète` → `STRIPE_SECRET_KEY`

### 3. Créer le produit et les prix

1. Produits → Ajouter un produit
2. Créer deux prix :
   - Prix unitaire (70€ HT)
   - Prix lot (60€ HT par unité)
3. Copier les IDs des prix (`price_XXXXX`)

### 4. Configurer le webhook

1. Développeurs → Webhooks → Ajouter un endpoint
2. URL : `https://votre-domaine.com/api/webhook/stripe`
3. Événements à écouter :
   - `checkout.session.completed`
   - `payment_intent.succeeded`
4. Copier le secret du webhook → `STRIPE_WEBHOOK_SECRET`

### 5. Mettre à jour `.env.local`

```env
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_XXXXX
STRIPE_SECRET_KEY=sk_live_XXXXX
STRIPE_WEBHOOK_SECRET=whsec_XXXXX
```

---

## 🚀 Déploiement

### Option 1 : Vercel (Recommandé)

1. Connecter le repo GitHub à Vercel
2. Configurer les variables d'environnement
3. Déployer automatiquement à chaque push

### Option 2 : Manuel

```bash
npm run build
npm start
```

### Variables d'environnement requises en production :

```env
# Stripe
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Email
RESEND_API_KEY=re_...
EMAIL_FROM=contact@rekaire.fr

# App
NEXT_PUBLIC_APP_URL=https://rekaire.fr
NEXT_PUBLIC_APP_NAME=Rekaire
```

---

## 📝 Résumé des fichiers importants

| Fichier | Description |
|---------|-------------|
| `src/config/admin.ts` | Prix, partenaires, stats, config produit |
| `src/config/product.ts` | Export des prix (utilise admin.ts) |
| `src/config/site.ts` | Infos entreprise, contact, SEO |
| `.env.local` | Clés API (Stripe, Resend, etc.) |

---

## 🆘 Support

Pour toute question technique, contacter l'équipe de développement.
