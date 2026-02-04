# 🔐 Guide Admin - Gestion des Commandes

## Vue d'ensemble

L'interface admin Rekaire permet de gérer les commandes, les expéditions et les factures.

**URL:** `https://rekaire.fr/admin`

**Accès:** Magic Link uniquement (contact@rekaire.fr)

---

## 🚀 Configuration initiale

### 1. Exécuter le script SQL dans Supabase

Allez dans **Supabase Dashboard** > **SQL Editor** et exécutez le contenu de:
```
supabase-orders-complete.sql
```

Ce script crée:
- ✅ Table `orders` enrichie (tracking, factures, statuts)
- ✅ Table `invoice_sequence` (numérotation FW-YYYY-XXXX)
- ✅ Table `admin_whitelist` (emails autorisés)
- ✅ Table `admin_audit_log` (traçabilité)
- ✅ Vue `orders_to_ship` (commandes à expédier)
- ✅ Fonction `get_next_invoice_number()`
- ✅ RLS policies (sécurité)

### 2. Créer le bucket Storage pour les factures

Dans **Supabase Dashboard** > **Storage**:
1. Cliquez "New bucket"
2. Nom: `invoices`
3. Public: **Non** (privé)
4. Cliquez "Create"

### 3. Variables d'environnement Vercel

Assurez-vous que ces variables sont configurées dans Vercel:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=votre_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=votre_anon_key
SUPABASE_SERVICE_ROLE_KEY=votre_service_role_key

# Stripe (LIVE)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Resend (emails)
RESEND_API_KEY=re_...

# App
NEXT_PUBLIC_APP_URL=https://rekaire.fr
ADMIN_EMAIL=contact@rekaire.fr
```

---

## 📱 Utilisation de l'Admin

### Connexion

1. Aller sur `https://rekaire.fr/admin`
2. Entrer `contact@rekaire.fr`
3. Cliquer "Recevoir le lien de connexion"
4. Vérifier l'email et cliquer sur le Magic Link
5. Vous êtes connecté pour 8 heures

### Dashboard

Le dashboard affiche:
- **Stats**: À expédier | En transit | Livrées | Total
- **Filtres**: Par statut (Toutes, À expédier, En transit, Livrées)
- **Tableau**: Liste des commandes avec détails

### Gérer une commande

#### Ajouter un numéro de suivi (Colissimo)

1. Trouver la commande avec statut "À expédier"
2. Cliquer sur "+ Tracking"
3. Entrer le numéro Colissimo (ex: `8R12345678901`)
4. Cliquer "Confirmer & Notifier"

**Résultat:**
- ✅ Statut passe à "En transit"
- ✅ Email envoyé au client avec lien de suivi La Poste
- ✅ Action loggée dans l'audit

#### Marquer comme livré

1. Trouver la commande avec statut "En transit"
2. Cliquer sur "✓ Livré"

**Résultat:**
- ✅ Statut passe à "Livré"
- ✅ Date de livraison enregistrée

---

## 📄 Factures

### Format
- **Numérotation**: FW-2026-0001, FW-2026-0002, etc.
- **Stockage**: Supabase Storage (privé, URLs signées 7 jours)
- **Contenu**: 
  - Infos entreprise NELIOR
  - Infos client
  - Détail produit
  - TVA 20%
  - Badge "PAYÉE"

### Générer une facture (via API)

Les factures peuvent être générées automatiquement via l'API:

```bash
POST /api/admin/invoices
Authorization: Bearer {votre_token}
Content-Type: application/json

{
  "orderId": "uuid-de-la-commande",
  "sendEmail": true
}
```

---

## 🔒 Sécurité

### Authentification
- **Magic Link** via Supabase Auth
- **Whitelist**: Seuls les emails dans `admin_whitelist` peuvent accéder
- **Session**: 8 heures maximum
- **Rate limiting**: 5 tentatives max / 15 minutes

### Audit
Toutes les actions sont loggées dans `admin_audit_log`:
- Connexion/déconnexion
- Consultation des commandes
- Ajout de tracking
- Génération de facture
- Changement de statut

---

## 📧 Emails automatiques

| Événement | Email envoyé | Contenu |
|-----------|--------------|---------|
| Paiement réussi | Confirmation commande | Récap, montant, adresse |
| Tracking ajouté | Expédition | N° suivi, lien Colissimo, timeline |
| Facture générée | Facture | Lien PDF signé (7 jours) |

---

## ⚠️ Ajouter un nouvel admin

Dans Supabase SQL Editor:
```sql
INSERT INTO admin_whitelist (email, name, is_active)
VALUES ('nouvel-admin@example.com', 'Nom Admin', true);
```

---

## 📊 Requêtes SQL utiles

### Commandes à expédier
```sql
SELECT * FROM orders_to_ship;
```

### Revenus du mois
```sql
SELECT 
  DATE_TRUNC('month', created_at) as month,
  COUNT(*) as orders,
  SUM(total_ttc)/100 as revenue_eur
FROM orders
WHERE status NOT IN ('cancelled', 'refunded')
GROUP BY 1
ORDER BY 1 DESC;
```

### Commandes du jour
```sql
SELECT COUNT(*), SUM(total_ttc)/100 as revenue
FROM orders
WHERE created_at::date = CURRENT_DATE
AND status = 'paid';
```
