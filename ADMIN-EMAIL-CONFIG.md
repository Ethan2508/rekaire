# 📧 Configuration Email Admin (Magic Link)

## ⚠️ Problème Actuel

Le Magic Link admin n'arrive pas car **Supabase doit être configuré pour envoyer des emails**.

Par défaut, Supabase utilise un serveur SMTP de développement qui a des limitations.

---

## ✅ Solution 1: Utiliser Resend avec Supabase (RECOMMANDÉ)

### Étape 1: Configurer SMTP dans Supabase

1. Aller sur [Supabase Dashboard](https://supabase.com/dashboard)
2. Sélectionner votre projet
3. **Settings** → **Auth** → **Email**
4. Activer **"Enable Custom SMTP"**

### Étape 2: Configuration Resend SMTP

Utiliser ces paramètres pour Resend :

```
SMTP Host: smtp.resend.com
SMTP Port: 465 (SSL) ou 587 (TLS)
SMTP Username: resend
SMTP Password: re_aQtJKLou_3XsTjb6CcBHyKtM2z2zPYd8a (votre clé API Resend)
Sender Email: noreply@rekaire.fr
Sender Name: Rekaire
```

### Étape 3: Templates d'emails

Dans **Auth** → **Email Templates**, personnaliser le template "Magic Link" :

```html
<h2>Connexion à l'admin Rekaire</h2>
<p>Cliquez sur le lien ci-dessous pour accéder au dashboard admin :</p>
<p><a href="{{ .ConfirmationURL }}">Se connecter</a></p>
<p>Ce lien expire dans 1 heure.</p>
<p>Si vous n'avez pas demandé cet accès, ignorez cet email.</p>
```

---

## ✅ Solution 2: Créer les utilisateurs Auth manuellement (TEMPORAIRE)

En attendant la config SMTP, créez les utilisateurs admin dans Supabase :

### Via Supabase Dashboard

1. **Authentication** → **Users** → **Add user**
2. Email: `contact@rekaire.fr`
3. Cocher **"Auto Confirm User"** (important!)
4. Définir un mot de passe temporaire

### Via SQL (plus rapide)

```sql
-- Créer l'utilisateur auth avec email vérifié
INSERT INTO auth.users (
  instance_id,
  id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  recovery_sent_at,
  last_sign_in_at,
  raw_app_meta_data,
  raw_user_meta_data,
  created_at,
  updated_at,
  confirmation_token,
  email_change,
  email_change_token_new,
  recovery_token
) VALUES (
  '00000000-0000-0000-0000-000000000000',
  gen_random_uuid(),
  'authenticated',
  'authenticated',
  'contact@rekaire.fr',
  crypt('ChangeMeLater123!', gen_salt('bf')), -- Mot de passe temporaire
  NOW(),
  NOW(),
  NOW(),
  '{"provider":"email","providers":["email"]}',
  '{}',
  NOW(),
  NOW(),
  '',
  '',
  '',
  ''
);
```

**Ensuite :**
1. Aller sur `/admin`
2. Utiliser le Magic Link (qui fonctionnera cette fois)
3. Ou se connecter avec email + mot de passe temporaire

---

## ✅ Solution 3: Alternative - Utiliser notre propre système d'email

Modifier `/api/admin/login/route.ts` pour envoyer le Magic Link via Resend au lieu de Supabase :

### Créer un token JWT maison

```typescript
import { SignJWT } from 'jose';

// Générer un token sécurisé
const secret = new TextEncoder().encode(process.env.JWT_SECRET);
const token = await new SignJWT({ email: normalizedEmail })
  .setProtectedHeader({ alg: 'HS256' })
  .setExpirationTime('1h')
  .sign(secret);

const magicLink = `${process.env.NEXT_PUBLIC_APP_URL}/admin/callback?token=${token}`;

// Envoyer via Resend
await resend.emails.send({
  from: 'noreply@rekaire.fr',
  to: normalizedEmail,
  subject: 'Connexion admin Rekaire',
  html: `<p>Cliquez ici : <a href="${magicLink}">Se connecter</a></p>`
});
```

### Vérifier le token dans /admin/callback

```typescript
import { jwtVerify } from 'jose';

const secret = new TextEncoder().encode(process.env.JWT_SECRET);
const { payload } = await jwtVerify(token, secret);
// payload.email contient l'email validé
```

---

## 🎯 Recommandation

**Solution 1 (SMTP Resend)** est la plus simple et professionnelle.

### Avantages :
- ✅ Pas de code à modifier
- ✅ Supabase gère tout (tokens, expiration, sécurité)
- ✅ Templates d'emails customisables
- ✅ Réutilisable pour reset password, etc.

### Configuration rapide :
**Temps estimé : 5 minutes**

1. Supabase → Settings → Auth → Enable Custom SMTP
2. Copier les paramètres Resend ci-dessus
3. Tester avec `/admin`

---

## 🧪 Tester l'envoi

Une fois configuré :

1. Aller sur https://www.rekaire.fr/admin
2. Entrer `contact@rekaire.fr`
3. Vérifier la boîte mail
4. Cliquer sur le lien Magic Link
5. Vérifier l'accès au dashboard

---

## ❓ Dépannage

### Email non reçu ?

**Vérifier dans Supabase Logs :**
1. Logs → Function Logs
2. Chercher "auth" ou "email"
3. Voir les erreurs SMTP

**Vérifier dans Resend Dashboard :**
1. https://resend.com/emails
2. Voir si l'email est envoyé
3. Statut : Delivered / Bounced / Failed

### Email en spam ?

- Vérifier SPF/DKIM configurés pour rekaire.fr
- Vérifier dans Resend → Domains → rekaire.fr → DNS Records

---

## 📝 Variables d'environnement requises

Pour la Solution 3 (JWT custom), ajouter :

```bash
JWT_SECRET=votre-secret-tres-long-et-aleatoire-ici-min-32-caracteres
```

Générer avec :
```bash
openssl rand -base64 32
```

---

Besoin d'aide pour configurer ? Dites-moi quelle solution vous préférez !
