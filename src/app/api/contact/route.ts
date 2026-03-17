// ============================================
// REKAIRE - API Contact Form (Sécurisée)
// Rate Limiting + Honeypot + Validation + Anti-spam
// ============================================

import { NextRequest, NextResponse } from 'next/server';
import { rateLimitDB } from '@/lib/rate-limit';

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

function isValidPhone(phone: string): boolean {
  // Accepte les formats français et internationaux
  const cleanPhone = phone.replace(/[\s.-]/g, '');
  return /^(\+33|0033|0)?[1-9][0-9]{8,9}$/.test(cleanPhone);
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
    } = body;
    
    // ========================================
    // Honeypot check (les bots remplissent ces champs)
    // ========================================
    if (honeypot || website || fax) {
      console.log('🤖 Bot détecté via honeypot');
      // Retourner success pour ne pas alerter le bot
      return NextResponse.json({ success: true });
    }
    
    // ========================================
    // Validation des champs requis
    // ========================================
    if (!name || !email || !message) {
      return NextResponse.json(
        { error: 'Veuillez remplir tous les champs obligatoires (nom, email, message)' },
        { status: 400 }
      );
    }
    
    // Longueur minimale
    if (name.length < 2) {
      return NextResponse.json(
        { error: 'Le nom doit contenir au moins 2 caractères' },
        { status: 400 }
      );
    }
    
    if (message.length < 10) {
      return NextResponse.json(
        { error: 'Le message doit contenir au moins 10 caractères' },
        { status: 400 }
      );
    }
    
    // ========================================
    // Validation email
    // ========================================
    if (!isValidEmail(email)) {
      return NextResponse.json(
        { error: 'Adresse email invalide' },
        { status: 400 }
      );
    }
    
    // ========================================
    // Validation téléphone (si fourni)
    // ========================================
    if (phone && !isValidPhone(phone)) {
      return NextResponse.json(
        { error: 'Numéro de téléphone invalide' },
        { status: 400 }
      );
    }
    
    // ========================================
    // Check spam
    // ========================================
    if (containsSpam(name) || containsSpam(message) || containsSpam(subject || '')) {
      console.log('🚫 Spam détecté dans formulaire contact');
      return NextResponse.json(
        { error: 'Votre message a été identifié comme spam' },
        { status: 400 }
      );
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
      ip: request.headers.get('x-forwarded-for')?.split(',')[0].trim() || 'unknown',
    };
    
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
        
        await resend.emails.send({
          from: 'Rekaire Contact <noreply@rekaire.fr>',
          to: 'contact@rekaire.fr',
          replyTo: sanitizedData.email,
          subject: `[Contact] ${sanitizedData.subject}`,
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
      message: 'Votre message a bien été envoyé. Nous vous répondrons dans les plus brefs délais.'
    });
    
  } catch (error) {
    console.error('❌ Erreur formulaire contact:', error);
    return NextResponse.json(
      { error: 'Une erreur est survenue. Veuillez réessayer.' },
      { status: 500 }
    );
  }
}
