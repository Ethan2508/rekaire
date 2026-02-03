# 🚀 Guide de configuration des fonctionnalités

## 📦 Fonctionnalités implémentées

### 1️⃣ Exit Popup ✅
**Capture automatique d'emails avant départ**

- Se déclenche quand le curseur sort vers le haut
- Affiche le code promo REKAIRE12
- Envoie l'email à Zapier (webhook contact)
- Ne s'affiche qu'une fois par session

**Aucune configuration nécessaire** - Fonctionne immédiatement !

---

### 2️⃣ Barre de progression Checkout ✅
**Navigation visuelle en 3 étapes**

1. Informations client
2. Adresse de livraison  
3. Paiement / Devis

**Aucune configuration nécessaire** - Intégrée dans /checkout

---

### 3️⃣ Système de codes promo ✅
**Validation dynamique avec Supabase**

#### Configuration Supabase (OBLIGATOIRE)

1. **Ouvrir Supabase Dashboard**
   - Allez sur https://supabase.com/dashboard
   - Sélectionnez votre projet Rekaire

2. **Exécuter le script SQL**
   - Cliquez sur "SQL Editor" dans le menu latéral
   - Cliquez "New Query"
   - Copiez-collez le contenu de `supabase_promo_codes.sql`
   - Cliquez "Run" (F5)

3. **Vérifier la table créée**
   ```sql
   SELECT * FROM promo_codes;
   ```
   Vous devriez voir le code **REKAIRE12** actif avec -10%

#### Gérer les codes promo

**Activer/Désactiver REKAIRE12 :**
```sql
-- Désactiver
UPDATE promo_codes SET active = false WHERE code = 'REKAIRE12';

-- Réactiver
UPDATE promo_codes SET active = true WHERE code = 'REKAIRE12';
```

**Créer un nouveau code :**
```sql
-- Code pourcentage (-15%)
INSERT INTO promo_codes (code, discount_type, discount_value, active, description)
VALUES ('PROMO15', 'percentage', 15, true, 'Promo -15% février');

-- Code montant fixe (-20€)
INSERT INTO promo_codes (code, discount_type, discount_value, active, description)
VALUES ('MOINS20', 'fixed', 20, true, 'Réduction de 20€');

-- Code avec limite d'utilisations
INSERT INTO promo_codes (
  code, discount_type, discount_value, 
  active, max_uses, description
)
VALUES ('LIMITED10', 'percentage', 10, true, 100, 'Limité à 100 utilisations');

-- Code avec date d'expiration
INSERT INTO promo_codes (
  code, discount_type, discount_value, 
  active, valid_until, description
)
VALUES ('FEV2026', 'percentage', 20, true, '2026-02-28 23:59:59', 'Valable jusqu''au 28/02/2026');

-- Code avec montant minimum de commande
INSERT INTO promo_codes (
  code, discount_type, discount_value, 
  active, min_order, description
)
VALUES ('BIG50', 'fixed', 50, true, 500, 'Commande minimum 500€');
```

**Voir les statistiques :**
```sql
SELECT 
  code, 
  discount_type,
  discount_value,
  current_uses,
  max_uses,
  active,
  created_at
FROM promo_codes
ORDER BY created_at DESC;
```

**Réinitialiser les usages :**
```sql
UPDATE promo_codes 
SET current_uses = 0 
WHERE code = 'REKAIRE12';
```

---

## 🎯 Utilisation

### Côté utilisateur
1. Sur `/checkout`, scrollez vers le récapitulatif de commande
2. Saisissez **REKAIRE12** dans le champ "Code promo"
3. Cliquez "Appliquer"
4. La réduction s'applique immédiatement

### Validation automatique
✅ Code actif/inactif  
✅ Dates de validité (valid_from / valid_until)  
✅ Nombre max d'utilisations  
✅ Montant minimum de commande  
✅ Incrémentation automatique du compteur

---

## 🔧 Configuration Meta Pixel & Google Ads

### Meta Pixel (Facebook/Instagram)

1. **Créer un Meta Pixel**
   - Allez sur https://business.facebook.com/events_manager
   - Cliquez "Connecter des sources de données" → "Web" → "Pixel Meta"
   - Notez votre **Pixel ID** (format: 123456789012345)

2. **Ajouter dans le code**
   Ouvrez `src/components/analytics.tsx` et ajoutez :
   ```tsx
   {/* Meta Pixel */}
   <script
     dangerouslySetInnerHTML={{
       __html: `
         !function(f,b,e,v,n,t,s)
         {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
         n.callMethod.apply(n,arguments):n.queue.push(arguments)};
         if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
         n.queue=[];t=b.createElement(e);t.async=!0;
         t.src=v;s=b.getElementsByTagName(e)[0];
         s.parentNode.insertBefore(t,s)}(window, document,'script',
         'https://connect.facebook.net/en_US/fbevents.js');
         fbq('init', 'VOTRE_PIXEL_ID');
         fbq('track', 'PageView');
       `,
     }}
   />
   ```

3. **Remplacez** `VOTRE_PIXEL_ID` par votre vrai ID

### Google Ads Conversion

1. **Créer une action de conversion**
   - Allez sur https://ads.google.com
   - "Outils et paramètres" → "Conversions"
   - "Nouvelle action de conversion" → "Site web"
   - Sélectionnez "Achat"
   - Notez votre **ID de conversion** (format: AW-123456789) et **Libellé**

2. **Ajouter dans le code**
   Dans `src/app/success/page.tsx`, ajoutez :
   ```tsx
   <script
     dangerouslySetInnerHTML={{
       __html: `
         gtag('event', 'conversion', {
           'send_to': 'AW-123456789/AbC_CONVERSION_LABEL',
           'value': ${montantCommande},
           'currency': 'EUR',
           'transaction_id': '${orderId}'
         });
       `,
     }}
   />
   ```

---

## 📊 Tableau de bord Supabase

### Voir les commandes
```sql
SELECT 
  id,
  customer_email,
  customer_name,
  quantity,
  total_ttc,
  status,
  created_at
FROM orders
ORDER BY created_at DESC
LIMIT 20;
```

### Voir les leads
```sql
SELECT 
  email,
  first_name,
  last_name,
  phone,
  company_name,
  source,
  created_at
FROM leads
ORDER BY created_at DESC
LIMIT 50;
```

### Dashboard stats rapides
```sql
-- Commandes du jour
SELECT COUNT(*), SUM(total_ttc) 
FROM orders 
WHERE created_at::date = CURRENT_DATE;

-- Codes promo utilisés
SELECT code, current_uses, max_uses
FROM promo_codes
WHERE active = true;

-- Leads par source
SELECT source, COUNT(*) 
FROM leads 
GROUP BY source;
```

---

## 🚨 Dépannage

### Le code promo ne fonctionne pas
1. Vérifiez dans Supabase : `SELECT * FROM promo_codes WHERE code = 'REKAIRE12';`
2. Vérifiez que `active = true`
3. Vérifiez les dates `valid_from` et `valid_until`
4. Vérifiez `current_uses < max_uses` (si max_uses est défini)

### Exit popup ne s'affiche pas
- Le popup s'affiche seulement :
  - Après 3 secondes sur le site
  - Quand le curseur sort vers le haut
  - Une seule fois par session
- Pour tester : fermez l'onglet et rouvrez-le

### Erreur "promo_codes table does not exist"
- Vous devez exécuter le script SQL dans Supabase
- Voir section "Configuration Supabase" ci-dessus

---

## ✅ Checklist de déploiement

- [ ] Script SQL exécuté dans Supabase
- [ ] Code REKAIRE12 visible dans la table promo_codes
- [ ] Test d'application du code sur /checkout
- [ ] Exit popup testé (sortir le curseur vers le haut)
- [ ] Meta Pixel ID ajouté (si souhaité)
- [ ] Google Ads conversion trackée (si souhaité)
- [ ] Variables d'environnement Supabase configurées :
  - `NEXT_PUBLIC_SUPABASE_URL`
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
  - `SUPABASE_SERVICE_ROLE_KEY`

---

## 🎉 Prochaines étapes recommandées

1. **Avis clients** - Intégrer Trustpilot ou créer un système maison
2. **Email marketing** - Séquences automatisées (bienvenue, panier abandonné)
3. **Dashboard admin** - Interface pour gérer codes promo visuellement
4. **A/B testing** - Tester différentes offres dans l'exit popup

---

**Besoin d'aide ?** Contactez le développeur ou consultez la documentation Supabase : https://supabase.com/docs
