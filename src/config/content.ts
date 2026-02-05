// ============================================
// REKAIRE - Content / Copy
// ============================================
// Tout le contenu texte centralisé pour faciliter l'édition
// Prêt pour i18n (multi-langue)

export const content = {
  // Hero Section
  hero: {
    badge: "Protection incendie nouvelle génération",
    headline: "Sécurité incendie autonome",
    headlineAccent: "pour tableaux électriques",
    subheadline:
      "Dispositif d'extinction automatique par aérosol. Sans câblage, sans alimentation, sans maintenance. Protection immédiate.",
    cta: {
      primary: "Commander maintenant",
      secondary: "Voir les spécifications",
    },
    stats: [
      { value: "170°C", label: "Activation auto" },
      { value: "5 ans", label: "Durée de vie" },
      { value: "< 30s", label: "Installation" },
      { value: "0", label: "Maintenance" },
    ],
  },

  // Features Section
  features: {
    title: "Fonctionnalités clés",
    subtitle: "",
    items: [
      {
        icon: "flame",
        title: "Activation automatique",
        description:
          "Se déclenche automatiquement à 170°C. Aucune intervention humaine nécessaire.",
      },
      {
        icon: "plug",
        title: "Zéro câblage",
        description:
          "Aucune alimentation électrique requise. Installation autonome et indépendante.",
      },
      {
        icon: "clock",
        title: "Installation rapide",
        description:
          "Se fixe en quelques secondes. Aucun outil spécial nécessaire.",
      },
      {
        icon: "shield",
        title: "Garantie 5 ans",
        description:
          "Fonctionnel pendant 5 ans.",
      },
      {
        icon: "zap",
        title: "Aérosol non conducteur",
        description:
          "Agent extincteur compatible avec les équipements électriques sous tension.",
      },
      {
        icon: "target",
        title: "Protection ciblée",
        description:
          "Conçu spécifiquement pour les tableaux et armoires électriques.",
      },
    ],
  },

  // How it works
  howItWorks: {
    title: "Comment ça fonctionne",
    subtitle: "Une technologie éprouvée, une mise en œuvre simple",
    steps: [
      {
        number: "01",
        title: "Fixez le RK01",
        description:
          "Installez le dispositif dans votre tableau électrique en quelques secondes.",
      },
      {
        number: "02",
        title: "Protection continue",
        description:
          "Le mécanisme de déclenchement surveille en permanence la température ambiante.",
      },
      {
        number: "03",
        title: "Activation en < 5 secondes",
        description:
          "En cas de surchauffe (170°C), l'aérosol extincteur se libère instantanément.",
      },
      {
        number: "04",
        title: "Incendie maîtrisé",
        description:
          "L'agent extincteur étouffe les flammes avant qu'elles ne se propagent.",
      },
    ],
  },

  // Social proof
  proof: {
    title: "Ils nous font confiance",
    subtitle: "Des professionnels qui protègent leurs installations",
    stats: [
      { value: "500+", label: "Installations protégées" },
      { value: "99.9%", label: "Fiabilité" },
      { value: "0", label: "Incidents depuis 2020" },
    ],
    // Testimonials placeholder
    testimonials: [
      {
        quote:
          "Solution simple et efficace. Installation en 2 minutes, tranquillité d'esprit pour 5 ans.",
        author: "Jean-Marc D.",
        role: "Électricien industriel",
        company: "ABC Électricité",
      },
      {
        quote:
          "Nous équipons tous nos TGBT avec le RK01. C'est devenu un standard.",
        author: "Sophie L.",
        role: "Responsable maintenance",
        company: "Groupe XYZ",
      },
    ],
  },

  // Guarantees
  guarantees: {
    title: "Garanties",
    items: [
      {
        title: "Garantie constructeur",
        description: "Produit garanti pendant toute sa durée de vie opérationnelle.",
      },
      {
        title: "Livraison rapide",
        description: "Expédition sous 24-48h ouvrées en France métropolitaine.",
      },
      {
        title: "Support technique",
        description: "Une question ? Notre équipe technique vous accompagne.",
      },
    ],
  },

  // CTA Section
  cta: {
    title: "Protégez vos installations",
    subtitle:
      "Commandez votre RK01 et sécurisez vos tableaux électriques dès aujourd'hui.",
    button: "Commander maintenant",
    note: "Paiement sécurisé • Livraison 24-48h",
  },

  // Footer
  footer: {
    description:
      "Rekaire conçoit des solutions de protection incendie autonomes pour les installations électriques.",
    links: {
      product: ["RK01", "Spécifications", "Documentation"],
      company: ["À propos", "Contact"],
      legal: ["Mentions légales", "CGV", "Politique de confidentialité"],
    },
    copyright: `© ${new Date().getFullYear()} Rekaire. Tous droits réservés.`,
  },

  // Success page
  success: {
    title: "Commande confirmée !",
    subtitle: "Merci pour votre confiance",
    message:
      "Vous allez recevoir un email de confirmation avec les détails de votre commande.",
    cta: "Retour à l'accueil",
  },

  // Cancel page
  cancel: {
    title: "Paiement annulé",
    subtitle: "Votre commande n'a pas été finalisée",
    message:
      "Aucun montant n'a été débité. Vous pouvez réessayer à tout moment.",
    cta: "Réessayer",
  },
} as const;

export type Content = typeof content;
