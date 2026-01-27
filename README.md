# REKAIRE - Site E-commerce One-Shot

## 🚀 Démarrage rapide

```bash
# Installation des dépendances
npm install

# Démarrage en développement
npm run dev

# Build production
npm run build

# Démarrage en production
npm start
```

## 📁 Structure du projet

```
src/
├── app/                    # Pages Next.js (App Router)
│   ├── api/               # API Routes
│   │   ├── checkout/      # Création session Stripe
│   │   └── webhook/       # Webhooks Stripe
│   ├── success/           # Page succès paiement
│   ├── cancel/            # Page annulation
│   ├── mentions-legales/  # Mentions légales
│   ├── cgv/               # CGV
│   ├── confidentialite/   # Politique confidentialité
│   └── contact/           # Contact
├── components/            # Composants React
│   └── sections/          # Sections de la landing page
├── config/                # Configuration centralisée
│   ├── site.ts           # Config site (meta, contact, etc.)
│   ├── product.ts        # Config produit(s)
│   ├── tracking.ts       # Config tracking (GTM, GA4, etc.)
│   ├── theme.ts          # Design system
│   └── content.ts        # Contenu texte (prêt i18n)
└── lib/                   # Utilitaires
    ├── stripe.ts         # Intégration Stripe
    ├── tracking.ts       # Fonctions tracking
    ├── email.ts          # Emails (Resend)
    ├── order.ts          # Gestion commandes
    └── utils.ts          # Helpers
```

## 🔐 Variables d'environnement

Copier `.env.example` vers `.env.local` et remplir :

```env
# Stripe
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_xxx
STRIPE_SECRET_KEY=sk_test_xxx
STRIPE_WEBHOOK_SECRET=whsec_xxx

# Tracking
NEXT_PUBLIC_GTM_ID=GTM-xxx
NEXT_PUBLIC_GA4_ID=G-xxx
NEXT_PUBLIC_META_PIXEL_ID=xxx
NEXT_PUBLIC_GOOGLE_ADS_ID=AW-xxx

# Email
RESEND_API_KEY=re_xxx
EMAIL_FROM=contact@rekaire.fr
```

## 🛒 Tunnel de paiement

```
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│   Landing Page    →    CTA Click    →    Stripe Checkout    │
│        │                   │                   │            │
│        │                   │                   │            │
│   [page_view]        [cta_click]         [checkout_start]   │
│                      [checkout_start]                       │
│                                                             │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│   Stripe Checkout (externe)                                 │
│        │                                                    │
│        ├── Paiement réussi → /success → [payment_success]   │
│        │                        │                           │
│        │                        └── Webhook → Email         │
│        │                                                    │
│        └── Paiement annulé → /cancel → [payment_failed]     │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

## 📊 Événements Tracking

| Événement | Description | Déclencheur |
|-----------|-------------|-------------|
| `page_view` | Vue de page | Chargement page |
| `cta_click` | Clic sur CTA | Clic bouton Commander |
| `checkout_start` | Début checkout | Avant redirection Stripe |
| `payment_success` | Paiement réussi | Page /success |
| `payment_failed` | Paiement échoué | Page /cancel |

## 🔗 Webhook Stripe

URL à configurer dans Stripe Dashboard :
```
https://votre-domaine.com/api/webhook/stripe
```

Événements à écouter :
- `checkout.session.completed`
- `checkout.session.expired`
- `payment_intent.payment_failed`

## 🚀 Déploiement Vercel

1. Push le code sur GitHub
2. Connecter le repo à Vercel
3. Configurer les variables d'environnement
4. Déployer

## ✅ Checklist Lighthouse

Objectifs :
- Performance: > 90
- Accessibility: > 90
- Best Practices: > 90
- SEO: > 90

## 📦 Technologies

- **Framework**: Next.js 14 (App Router)
- **Langage**: TypeScript
- **Styles**: Tailwind CSS
- **Animations**: Framer Motion
- **Paiement**: Stripe Checkout
- **Email**: Resend
- **Icônes**: Lucide React
- **Hébergement**: Vercel

## 🔧 Scripts disponibles

```bash
npm run dev      # Développement
npm run build    # Build production
npm run start    # Démarrage production
npm run lint     # Linting
```

## 📝 TODO

- [ ] Ajouter images produit réelles
- [ ] Configurer clés Stripe production
- [ ] Configurer tracking (GTM, GA4, Meta, Google Ads)
- [ ] Compléter mentions légales
- [ ] Ajouter Payload CMS pour dashboard admin
- [ ] Tests Lighthouse finaux

---

**Rekaire** - Sécurité incendie autonome
