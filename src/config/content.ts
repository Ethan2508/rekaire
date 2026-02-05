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
        title: "Déclenchement thermique automatique",
        description:
          "Activation autonome dès 170 °C pour neutraliser un départ de feu sans intervention humaine.",
      },
      {
        icon: "plug",
        title: "Fonctionnement 100 % autonome",
        description:
          "Sans alimentation électrique ni raccordement. Le dispositif fonctionne de manière totalement indépendante.",
      },
      {
        icon: "clock",
        title: "Pose simple et immédiate",
        description:
          "Installation en quelques secondes, sans outil spécifique ni modification de l'installation existante.",
      },
      {
        icon: "shield",
        title: "Durée de vie de 5 ans",
        description:
          "Dispositif scellé et opérationnel pendant 5 ans, sans maintenance.",
      },
      {
        icon: "zap",
        title: "Agent extincteur non conducteur",
        description:
          "Conçu pour intervenir sur des équipements électriques, même sous tension.",
      },
      {
        icon: "target",
        title: "Protection à la source du risque",
        description:
          "Spécialement conçu pour les tableaux et armoires électriques jusqu'à 0,1 m³.",
      },
    ],
  },

  // How it works
  howItWorks: {
    title: "Comment fonctionne le RK01",
    subtitle: "Une protection incendie autonome, simple à déployer et toujours active.",
    steps: [
      {
        number: "01",
        title: "Installation du dispositif",
        description:
          "Fixez le RK01 dans le tableau ou l'armoire électrique en quelques secondes, sans modification de l'existant.",
      },
      {
        number: "02",
        title: "Surveillance thermique permanente",
        description:
          "Le dispositif contrôle en continu la température à l'intérieur du tableau électrique.",
      },
      {
        number: "03",
        title: "Déclenchement automatique",
        description:
          "En cas de surchauffe (170 °C), le dispositif s'active automatiquement en moins de 5 secondes.",
      },
      {
        number: "04",
        title: "Départ de feu neutralisé",
        description:
          "L'agent extincteur agit directement à la source pour empêcher la propagation de l'incendie.",
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
