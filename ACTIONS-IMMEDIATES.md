# ✅ ACTIONS IMMÉDIATES - REKAIRE

## 🔥 URGENT (À faire maintenant)

### 1. Exécuter le script de sécurité SQL

**Fichier:** `supabase-security-hardening.sql`

**Actions:**
1. Ouvrir Supabase Dashboard: https://supabase.com/dashboard
2. Sélectionner votre projet Rekaire
3. Aller dans **SQL Editor**
4. Copier-coller tout le contenu de `supabase-security-hardening.sql`
5. Cliquer sur **Run** (Exécuter)

**Ce que ça fait:**
- ✅ Bloque l'accès direct aux codes promo depuis le frontend
- ✅ Crée la table d'audit `promo_usage_log`
- ✅ Crée la fonction `increment_promo_usage()`
- ✅ Crée la fonction `log_promo_usage()`
- ✅ Crée la vue `promo_fraud_detection`
- ✅ Configure les RLS policies sécurisées

---

### 2. Tester le flux de paiement complet

**Test avec carte Stripe TEST:**
```
Numéro: 4242 4242 4242 4242
Date: n'importe quelle date future (ex: 12/28)
CVC: n'importe quel 3 chiffres (ex: 123)
```

**Scénario de test:**
1. Aller sur https://www.rekaire.fr/produit
2. Ajouter 2 unités au panier
3. Remplir le formulaire de commande
4. Tester avec/sans code promo
5. Payer avec la carte TEST
6. Vérifier:
   - ✅ Redirection vers `/success`
   - ✅ Email de confirmation reçu
   - ✅ Commande dans Supabase `orders` table
   - ✅ Statut = "paid"
   - ✅ Prix correct (144€ pour 2 unités, pas 14400€)

---

### 3. Vérifier le webhook Stripe

**Configurer le webhook dans Stripe Dashboard:**
1. Aller sur https://dashboard.stripe.com/webhooks
2. Cliquer sur **Add endpoint**
3. URL: `https://www.rekaire.fr/api/webhook/stripe`
4. Événements à écouter:
   - `checkout.session.completed`
   - `checkout.session.expired`
   - `payment_intent.succeeded`
   - `payment_intent.payment_failed`
5. Copier le **Signing secret**
6. L'ajouter dans Vercel: `STRIPE_WEBHOOK_SECRET`

**Tester le webhook:**
1. Faire un paiement test
2. Vérifier dans Stripe Dashboard → Webhooks → Logs
3. Le webhook doit retourner `200 OK`

---

## 📋 ACTIONS COURT TERME (Cette semaine)

### 4. Vérifier les variables d'environnement Vercel

**Variables requises:**
```
NEXT_PUBLIC_SUPABASE_URL=https://...supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...

STRIPE_SECRET_KEY=sk_test_... (ou sk_live_... en prod)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_... (ou pk_live_... en prod)
STRIPE_WEBHOOK_SECRET=whsec_...

RESEND_API_KEY=re_...
RESEND_FROM_EMAIL=noreply@rekaire.fr

NEXT_PUBLIC_APP_URL=https://www.rekaire.fr
```

**Vérifier:**
1. Aller sur https://vercel.com/dashboard
2. Sélectionner le projet Rekaire
3. Settings → Environment Variables
4. S'assurer que TOUTES les variables sont définies

---

### 5. Créer des codes promo de test

**Dans Supabase:**
1. Aller dans **Table Editor** → `promo_codes`
2. Créer quelques codes:

**Exemple 1: Code WELCOME10 - 10% de réduction**
```sql
INSERT INTO promo_codes (
  code, 
  discount_type, 
  discount_value, 
  active, 
  max_uses, 
  current_uses,
  min_order,
  valid_until
) VALUES (
  'WELCOME10',
  'percentage',
  10,
  true,
  100,
  0,
  5000,  -- 50€ minimum
  '2026-12-31'
);
```

**Exemple 2: Code FIRST20 - 20€ de réduction**
```sql
INSERT INTO promo_codes (
  code, 
  discount_type, 
  discount_value, 
  active, 
  max_uses, 
  current_uses,
  min_order
) VALUES (
  'FIRST20',
  'fixed',
  2000,  -- 20€ en centimes
  true,
  50,
  0,
  10000  -- 100€ minimum
);
```

**Tester les codes:**
1. Aller sur le checkout
2. Entrer un code promo
3. Vérifier que la réduction s'applique
4. Vérifier dans `promo_usage_log` après paiement

---

### 6. Tester le dashboard admin

**Test Magic Link:**
1. Aller sur https://www.rekaire.fr/admin
2. Entrer l'email whitelisté: `contact@rekaire.fr`
3. Vérifier l'email avec le Magic Link
4. Cliquer sur le lien
5. Vérifier accès au dashboard

**Test gestion commandes:**
1. Voir la liste des commandes
2. Changer le statut d'une commande
3. Ajouter un numéro de tracking
4. Générer une facture PDF
5. Envoyer l'email de tracking

---

## 🎯 ACTIONS MOYEN TERME (Ce mois)

### 7. Monitoring & Alertes

**Installer Sentry (optionnel):**
```bash
npm install @sentry/nextjs
npx @sentry/wizard@latest -i nextjs
```

**Configurer alertes email:**
- Créer une fonction pour envoyer des emails en cas de fraude détectée
- L'appeler depuis le webhook quand montant incorrect

---

### 8. Passer en PRODUCTION Stripe

**Quand tout est testé:**
1. Aller sur Stripe Dashboard
2. Activer le mode PRODUCTION
3. Créer des clés LIVE:
   - API key: `sk_live_...`
   - Publishable key: `pk_live_...`
   - Webhook secret: `whsec_...` (recréer le webhook en mode live)
4. Remplacer les variables dans Vercel par les clés LIVE
5. Redéployer l'application

**⚠️ IMPORTANT:** 
- Les clés TEST et LIVE sont différentes
- Le webhook TEST et LIVE sont différents
- Tester en TEST avant de passer en LIVE

---

## 🔍 CHECKLIST FINALE AVANT PRODUCTION

- [ ] Script SQL `supabase-security-hardening.sql` exécuté
- [ ] Paiement test réussi (avec carte 4242...)
- [ ] Email de confirmation reçu
- [ ] Commande visible dans Supabase
- [ ] Prix correct affiché (84€, pas 8400€)
- [ ] Code promo fonctionne
- [ ] Webhook Stripe configuré et fonctionnel
- [ ] Dashboard admin accessible avec Magic Link
- [ ] Génération de facture PDF fonctionne
- [ ] Email de tracking envoyé
- [ ] Toutes les variables d'environnement configurées
- [ ] Clés Stripe LIVE configurées (si production)
- [ ] DNS configuré pour rekaire.fr
- [ ] SSL actif (HTTPS)

---

## 📞 SUPPORT

Si vous rencontrez un problème:

1. **Logs Vercel:** https://vercel.com/dashboard → Functions → Logs
2. **Logs Supabase:** Supabase Dashboard → Logs
3. **Logs Stripe:** Stripe Dashboard → Developers → Logs
4. **Vérifier fichier:** `SECURITY-AUDIT.md` pour les détails techniques

---

## 🎉 TOUT EST PRÊT !

Une fois ces actions effectuées, le site est **100% opérationnel et sécurisé** pour accepter des paiements en production.

Bon lancement ! 🚀
