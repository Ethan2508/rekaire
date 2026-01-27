// ============================================
// REKAIRE - API Contact Form (Sécurisée)
// Honeypot + Validation + Anti-spam
// ============================================

import { NextRequest, NextResponse } from 'next/server';

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
    // TODO: Envoyer email via Resend
    // ========================================
    // Décommenter quand Resend est configuré:
    /*
    if (process.env.RESEND_API_KEY) {
      const { Resend } = await import('resend');
      const resend = new Resend(process.env.RESEND_API_KEY);
      
      await resend.emails.send({
        from: 'Rekaire Contact <noreply@rekaire.fr>',
        to: 'contact@rekaire.fr',
        replyTo: sanitizedData.email,
        subject: `[Contact] ${sanitizedData.subject}`,
        html: `
          <h2>Nouveau message de contact</h2>
          <p><strong>Nom :</strong> ${sanitizedData.name}</p>
          <p><strong>Email :</strong> ${sanitizedData.email}</p>
          ${sanitizedData.phone ? `<p><strong>Téléphone :</strong> ${sanitizedData.phone}</p>` : ''}
          ${sanitizedData.company ? `<p><strong>Entreprise :</strong> ${sanitizedData.company}</p>` : ''}
          <p><strong>Sujet :</strong> ${sanitizedData.subject}</p>
          <hr>
          <p><strong>Message :</strong></p>
          <p>${sanitizedData.message.replace(/\n/g, '<br>')}</p>
          <hr>
          <p><small>Envoyé le ${sanitizedData.timestamp} depuis IP: ${sanitizedData.ip}</small></p>
        `,
      });
    }
    */
    
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
