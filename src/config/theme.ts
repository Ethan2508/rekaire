// ============================================
// REKAIRE - Design System / Theme
// ============================================
// Couleurs, typographies, espacements centralisés

export const theme = {
  colors: {
    // Primaires
    black: "#0A0A0A",
    white: "#FFFFFF",
    
    // Gris
    gray: {
      50: "#FAFAFA",
      100: "#F5F5F5",
      200: "#E5E5E5",
      300: "#D4D4D4",
      400: "#A3A3A3",
      500: "#737373",
      600: "#525252",
      700: "#404040",
      800: "#262626",
      900: "#171717",
      950: "#0A0A0A",
    },
    
    // Accent (orange sécurité)
    accent: {
      light: "#FB923C", // orange-400
      DEFAULT: "#F97316", // orange-500
      dark: "#EA580C", // orange-600
    },
    
    // Sémantiques
    success: "#22C55E",
    error: "#EF4444",
    warning: "#F59E0B",
    info: "#3B82F6",
  },
  
  // Fonts - Duo premium, industriel, sérieux
  fonts: {
    // Heading: Inter - Clean, moderne, lisible
    heading: "var(--font-inter)",
    // Body: Inter - Cohérence
    body: "var(--font-inter)",
    // Mono: Pour specs techniques
    mono: "var(--font-mono)",
  },
  
  // Spacing system
  spacing: {
    section: {
      sm: "py-12 md:py-16",
      md: "py-16 md:py-24",
      lg: "py-24 md:py-32",
    },
    container: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8",
  },
  
  // Border radius
  radius: {
    sm: "rounded",
    md: "rounded-md",
    lg: "rounded-lg",
    xl: "rounded-xl",
    full: "rounded-full",
  },
  
  // Shadows
  shadows: {
    sm: "shadow-sm",
    md: "shadow-md",
    lg: "shadow-lg",
    xl: "shadow-xl",
    glow: "shadow-[0_0_30px_rgba(249,115,22,0.3)]",
  },
  
  // Transitions
  transition: {
    fast: "transition-all duration-150 ease-out",
    normal: "transition-all duration-300 ease-out",
    slow: "transition-all duration-500 ease-out",
  },
} as const;

// Classes Tailwind prédéfinies pour cohérence
export const styles = {
  // Headings
  h1: "text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight",
  h2: "text-3xl md:text-4xl font-bold tracking-tight",
  h3: "text-2xl md:text-3xl font-semibold",
  h4: "text-xl md:text-2xl font-semibold",
  
  // Body text
  bodyLarge: "text-lg md:text-xl text-gray-300",
  body: "text-base text-gray-400",
  bodySmall: "text-sm text-gray-500",
  
  // Buttons
  btnPrimary: `
    inline-flex items-center justify-center
    px-8 py-4 text-lg font-semibold
    bg-gradient-to-r from-orange-500 to-orange-600
    hover:from-orange-600 hover:to-orange-700
    text-white rounded-lg
    transition-all duration-300
    shadow-lg hover:shadow-xl hover:shadow-orange-500/25
    hover:-translate-y-0.5
    focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 focus:ring-offset-black
  `,
  btnSecondary: `
    inline-flex items-center justify-center
    px-8 py-4 text-lg font-semibold
    bg-white/5 hover:bg-white/10
    text-white rounded-lg
    border border-white/10 hover:border-white/20
    transition-all duration-300
    focus:outline-none focus:ring-2 focus:ring-white/20
  `,
  btnGhost: `
    inline-flex items-center justify-center
    px-4 py-2 text-sm font-medium
    text-gray-400 hover:text-white
    transition-colors duration-200
  `,
  
  // Cards
  card: `
    bg-white/5 backdrop-blur-sm
    border border-white/10
    rounded-xl p-6
  `,
  cardHover: `
    hover:bg-white/10 hover:border-white/20
    transition-all duration-300
  `,
  
  // Sections
  sectionDark: "bg-black text-white",
  sectionLight: "bg-gray-950 text-white",
  
  // Container
  container: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8",
} as const;
