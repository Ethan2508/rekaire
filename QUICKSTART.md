# 🎯 CONFIGURATION RAPIDE - 5 MINUTES

## ⚡ Étape 1 : Exécuter le script Supabase

1. **Ouvrez votre Supabase Dashboard**
   👉 https://supabase.com/dashboard/project/YOUR_PROJECT_ID

2. **Cliquez sur "SQL Editor"** (icône </> dans le menu)

3. **Créez une nouvelle query** → Bouton "+ New query"

4. **Copiez-collez le fichier `supabase_promo_codes.sql`**
   
5. **Cliquez "Run"** (ou F5)

6. **Vérifiez que ça fonctionne :**
   ```sql
   SELECT * FROM promo_codes;
   ```
   ✅ Vous devriez voir REKAIRE12 avec discount_value = 10

---

## ✅ C'EST TOUT !

Le site est maintenant prêt avec :

### 🎁 Exit Popup
- Se déclenche automatiquement quand on sort de la page
- Capture l'email
- Affiche le code REKAIRE12

### 📊 Barre de progression
- 3 étapes visuelles sur /checkout
- Navigation claire et intuitive

### 💰 Codes promo
- Champ "Code promo" dans le checkout
- Validation automatique depuis Supabase
- REKAIRE12 = -10% actif par défaut

---

## 🧪 TEST RAPIDE

1. **Allez sur** https://rekaire.vercel.app/checkout?qty=1

2. **Remplissez le formulaire**

3. **Dans le récapitulatif** → Entrez **REKAIRE12**

4. **Cliquez "Appliquer"**

5. ✅ Le prix devrait baisser de 10%

---

## 📱 GESTION DES CODES PROMO

### Désactiver REKAIRE12
```sql
UPDATE promo_codes 
SET active = false 
WHERE code = 'REKAIRE12';
```

### Réactiver REKAIRE12
```sql
UPDATE promo_codes 
SET active = true 
WHERE code = 'REKAIRE12';
```

### Créer un nouveau code -20%
```sql
INSERT INTO promo_codes (code, discount_type, discount_value, active)
VALUES ('PROMO20', 'percentage', 20, true);
```

### Voir les stats d'utilisation
```sql
SELECT code, current_uses, active 
FROM promo_codes;
```

---

## 🆘 PROBLÈME ?

**Le code ne s'applique pas :**
- Vérifiez que la table existe : `SELECT * FROM promo_codes;`
- Vérifiez que REKAIRE12 est actif : `active = true`
- Rechargez la page /checkout

**Exit popup ne s'affiche pas :**
- Normal ! Il s'affiche seulement quand le curseur sort vers le haut
- Testé après 3 secondes sur le site
- Une fois par session uniquement

**Erreur "table does not exist" :**
- Vous devez exécuter le script SQL (voir Étape 1)

---

## 📚 Documentation complète

Voir **FEATURES_SETUP.md** pour :
- Meta Pixel (Facebook/Instagram)
- Google Ads conversion tracking
- Codes promo avancés (dates, limites, montant min)
- Dashboard SQL personnalisés

---

**Tout est prêt ! Le déploiement Vercel est en cours (~1 minute)** 🚀
