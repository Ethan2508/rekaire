// ============================================
// REKAIRE - API Contact Form (Sécurisée)
// Rate Limiting + Honeypot + Validation + Anti-spam
// ============================================

import { NextRequest, NextResponse } from 'next/server';
import { rateLimitDB } from '@/lib/rate-limit';

const TURNSTILE_SECRET = process.env.TURNSTILE_SECRET_KEY;

// Validation email stricte
const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

// Domaines email temporaires bloqués
const BLOCKED_DOMAINS = [
  'tempmail.com',
  'throwaway.email',
  'guerrillamail.com',
  'mailinator.com',
  '10minutemail.com',
  'yopmail.com',
  'temp-mail.org',
  'fakeinbox.com',
  'trashmail.com',
];

// Mots-clés spam
const SPAM_KEYWORDS = [
  'viagra', 'casino', 'crypto', 'bitcoin', 'lottery',
  'winner', 'prince', 'inheritance', 'million dollars',
  'free money', 'click here', 'act now', 'limited time',
  'congratulations', 'selected', 'claim your',
];

function isValidEmail(email: string): boolean {
  if (!EMAIL_REGEX.test(email)) return false;
  
  const domain = email.split('@')[1]?.toLowerCase();
  if (!domain) return false;
  
  return !BLOCKED_DOMAINS.some(blocked => domain.includes(blocked));
}

function containsSpam(text: string): boolean {
  const lowerText = text.toLowerCase();
  return SPAM_KEYWORDS.some(keyword => lowerText.includes(keyword));
}

function sanitizeInput(input: string): string {
  return input
    .replace(/<[^>]*>/g, '') // Remove HTML tags
    .replace(/[<>]/g, '') // Remove remaining angle brackets
    .replace(/javascript:/gi, '') // Remove JS protocol
    .replace(/on\w+=/gi, '') // Remove event handlers
    .trim()
    .substring(0, 5000); // Limit length
}

function isValidPhone(phone: string, locale: Locale): boolean {
  const cleanPhone = phone.replace(/[\s.()-]/g, '');
  if (locale === 'es') {
    // Formato internacional (clientes españoles y extranjeros)
    return /^(\+|00)?[0-9]{9,15}$/.test(cleanPhone);
  }
  // Accepte les formats français et internationaux
  return /^(\+33|0033|0)?[1-9][0-9]{8,9}$/.test(cleanPhone);
}

// ========================================
// Site espagnol (formulaire professionnel rekaire.es)
// ========================================

type Locale = 'fr' | 'es';

const MESSAGES = {
  fr: {
    turnstile: 'La vérification anti-spam a échoué. Veuillez réessayer.',
    required: 'Veuillez remplir tous les champs obligatoires (nom, email, message)',
    nameLength: 'Le nom doit contenir au moins 2 caractères',
    messageLength: 'Le message doit contenir au moins 10 caractères',
    email: 'Adresse email invalide',
    phone: 'Numéro de téléphone invalide',
    spam: 'Votre message a été identifié comme spam',
    consent: '',
    success: 'Votre message a bien été envoyé. Nous vous répondrons dans les plus brefs délais.',
    error: 'Une erreur est survenue. Veuillez réessayer.',
  },
  es: {
    turnstile: 'La verificación antispam ha fallado. Inténtalo de nuevo.',
    required: 'Completa todos los campos obligatorios.',
    nameLength: 'El nombre debe tener al menos 2 caracteres.',
    messageLength: 'El mensaje debe tener al menos 10 caracteres.',
    email: 'Dirección de email no válida.',
    phone: 'Número de teléfono no válido.',
    spam: 'Tu mensaje ha sido identificado como spam.',
    consent: 'Debes aceptar la política de privacidad.',
    success: 'Tu solicitud se ha enviado correctamente. Te responderemos lo antes posible.',
    error: 'Se ha producido un error. Inténtalo de nuevo.',
  },
} as const;

const ES_REQUEST_TYPES: Record<string, string> = {
  proyecto: 'Estudiar un proyecto',
  documentacion: 'Solicitud de documentación técnica',
  distribuidor: 'Distribuidor',
  contacto: 'Contacto',
};

// Destinataire des demandes espagnoles (contacto@rekaire.es une fois la boîte OVH active)
const ES_RECIPIENT = process.env.CONTACT_EMAIL_ES || 'contact@rekaire.fr';

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

async function verifyTurnstile(token: string, ip: string): Promise<boolean> {
  if (!TURNSTILE_SECRET) {
    console.warn('[Contact API] TURNSTILE_SECRET_KEY non configuré');
    return process.env.NODE_ENV !== 'production';
  }

  try {
    const response = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        secret: TURNSTILE_SECRET,
        response: token,
        remoteip: ip,
      }),
    });
    const data = await response.json() as { success?: boolean };
    return data.success === true;
  } catch (error) {
    console.error('[Contact API] Turnstile verification error:', error);
    return false;
  }
}

export async function POST(request: NextRequest) {
  // 🔒 RATE LIMITING (5 requêtes par minute max)
  const rateLimitResponse = await rateLimitDB(request, {
    maxRequests: 5,
    keyPrefix: "contact",
  });
  if (rateLimitResponse) {
    return rateLimitResponse;
  }

  try {
    const body = await request.json();
    const { 
      name, 
      email, 
      phone, 
      company, 
      subject, 
      message, 
      // Honeypot fields (doivent être vides)
      honeypot, 
      website,
      fax,
      turnstileToken,
      // Champs du formulaire professionnel espagnol
      requestType,
      province,
      activity,
      panels,
      panelSize,
      consent,
    } = body;
    const locale: Locale = body.locale === 'es' ? 'es' : 'fr';
    const t = MESSAGES[locale];
    
    // ========================================
    // Honeypot check (les bots remplissent ces champs)
    // ========================================
    if (honeypot || website || fax) {
      console.log('🤖 Bot détecté via honeypot');
      // Retourner success pour ne pas alerter le bot
      return NextResponse.json({ success: true });
    }

    const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim()
      || request.headers.get('x-real-ip')
      || 'unknown';

    // Erreur explicite (et non faux succès) : un vrai client dont le token
    // a expiré doit pouvoir réessayer au lieu de perdre son message
    if (!turnstileToken || !await verifyTurnstile(turnstileToken, ip)) {
      console.log('[Contact API] Soumission bloquée par Turnstile');
      return NextResponse.json({ error: t.turnstile }, { status: 403 });
    }
    
    // ========================================
    // Validation des champs requis
    // ========================================
    if (!name || !email || !message ||
        (locale === 'es' && (!company || !phone || !province || !activity))) {
      return NextResponse.json({ error: t.required }, { status: 400 });
    }

    if (locale === 'es' && consent !== true) {
      return NextResponse.json({ error: t.consent }, { status: 400 });
    }
    
    // Longueur minimale
    if (name.length < 2) {
      return NextResponse.json({ error: t.nameLength }, { status: 400 });
    }
    
    if (message.length < 10) {
      return NextResponse.json({ error: t.messageLength }, { status: 400 });
    }
    
    // ========================================
    // Validation email
    // ========================================
    if (!isValidEmail(email)) {
      return NextResponse.json({ error: t.email }, { status: 400 });
    }
    
    // ========================================
    // Validation téléphone (si fourni)
    // ========================================
    if (phone && !isValidPhone(phone, locale)) {
      return NextResponse.json({ error: t.phone }, { status: 400 });
    }
    
    // ========================================
    // Check spam
    // ========================================
    if (containsSpam(name) || containsSpam(message) || containsSpam(subject || '')) {
      console.log('🚫 Spam détecté dans formulaire contact');
      return NextResponse.json({ error: t.spam }, { status: 400 });
    }
    
    // ========================================
    // Sanitize inputs
    // ========================================
    const sanitizedData = {
      name: sanitizeInput(name),
      email: email.toLowerCase().trim(),
      phone: phone ? sanitizeInput(phone) : undefined,
      company: company ? sanitizeInput(company) : undefined,
      subject: subject ? sanitizeInput(subject) : 'Contact depuis le site',
      message: sanitizeInput(message),
      timestamp: new Date().toISOString(),
      ip,
    };

    // Détails professionnels (site espagnol), échappés pour l'email
    const esDetails: [string, string][] = locale === 'es'
      ? ([
          ['Solicitud', ES_REQUEST_TYPES[requestType] || 'Contacto'],
          ['Provincia', province],
          ['Actividad', activity],
          ['Nº aprox. de cuadros', panels],
          ['Dimensiones / volumen', panelSize],
        ] as [string, unknown][])
          .filter(([, v]) => typeof v === 'string' && v.trim() !== '')
          .map(([k, v]) => [k, escapeHtml(sanitizeInput(v as string).substring(0, 200))])
      : [];
    
    // ========================================
    // Log pour debug (en prod, envoyer par email)
    // ========================================
    console.log('📧 Nouveau contact reçu:', {
      name: sanitizedData.name,
      email: sanitizedData.email,
      subject: sanitizedData.subject,
      timestamp: sanitizedData.timestamp,
    });
    
    // ========================================
    // Envoyer email via Resend
    // ========================================
    if (process.env.RESEND_API_KEY) {
      try {
        const { Resend } = await import('resend');
        const resend = new Resend(process.env.RESEND_API_KEY);
        
        const esSubject = `[ES] ${ES_REQUEST_TYPES[requestType] || 'Contacto'} – ${sanitizedData.company || sanitizedData.name}`;

        await resend.emails.send({
          from: locale === 'es' ? 'Rekaire España <noreply@rekaire.fr>' : 'Rekaire Contact <noreply@rekaire.fr>',
          to: locale === 'es' ? ES_RECIPIENT : 'contact@rekaire.fr',
          replyTo: sanitizedData.email,
          subject: locale === 'es' ? esSubject : `[Contact] ${sanitizedData.subject}`,
          html: `
            <!DOCTYPE html>
            <html>
            <head>
              <style>
                body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                .header { background: linear-gradient(135deg, #f97316, #ea580c); color: white; padding: 20px; border-radius: 8px 8px 0 0; }
                .content { background: #f9fafb; padding: 20px; border: 1px solid #e5e7eb; }
                .field { margin-bottom: 15px; }
                .label { font-weight: bold; color: #374151; }
                .value { color: #1f2937; }
                .message-box { background: white; padding: 15px; border-radius: 8px; border-left: 4px solid #f97316; }
                .footer { font-size: 12px; color: #6b7280; padding: 15px; text-align: center; }
              </style>
            </head>
            <body>
              <div class="container">
                <div class="header">
                  <h2 style="margin:0;">📧 Nouveau message de contact</h2>
                </div>
                <div class="content">
                  <div class="field">
                    <span class="label">Nom :</span> 
                    <span class="value">${sanitizedData.name}</span>
                  </div>
                  <div class="field">
                    <span class="label">Email :</span> 
                    <span class="value"><a href="mailto:${sanitizedData.email}">${sanitizedData.email}</a></span>
                  </div>
                  ${sanitizedData.phone ? `
                  <div class="field">
                    <span class="label">Téléphone :</span> 
                    <span class="value"><a href="tel:${sanitizedData.phone}">${sanitizedData.phone}</a></span>
                  </div>` : ''}
                  ${sanitizedData.company ? `
                  <div class="field">
                    <span class="label">Entreprise :</span> 
                    <span class="value">${sanitizedData.company}</span>
                  </div>` : ''}
                  <div class="field">
                    <span class="label">Sujet :</span> 
                    <span class="value">${sanitizedData.subject}</span>
                  </div>
                  ${esDetails.map(([label, value]) => `
                  <div class="field">
                    <span class="label">${label} :</span> 
                    <span class="value">${value}</span>
                  </div>`).join('')}
                  <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 20px 0;">
                  <div class="field">
                    <span class="label">Message :</span>
                  </div>
                  <div class="message-box">
                    ${sanitizedData.message.replace(/\n/g, '<br>')}
                  </div>
                </div>
                <div class="footer">
                  Envoyé le ${new Date(sanitizedData.timestamp).toLocaleString('fr-FR')} | IP: ${sanitizedData.ip}
                </div>
              </div>
            </body>
            </html>
          `,
        });
        console.log('✅ Email envoyé via Resend');
      } catch (emailError) {
        console.error('❌ Erreur envoi email Resend:', emailError);
        // On continue quand même pour ne pas bloquer l'utilisateur
      }
    } else {
      console.warn('⚠️ RESEND_API_KEY non configurée - email non envoyé');
    }
    
    return NextResponse.json({ 
      success: true,
      message: t.success,
    });
    
  } catch (error) {
    console.error('❌ Erreur formulaire contact:', error);
    return NextResponse.json(
      { error: 'Une erreur est survenue. Veuillez réessayer.' },
      { status: 500 }
    );
  }
}
