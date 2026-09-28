"use client";

// ============================================
// REKAIRE ES - Primitivas de interfaz
// Mismos estilos que el sitio francés (naranja, rounded, framer-motion)
// ============================================

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { trackCTAClick } from "@/lib/tracking";

export function Reveal({
  children,
  delay = 0,
  className,
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.55, delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function Badge({
  icon: Icon,
  children,
  tone = "light",
}: {
  icon?: LucideIcon;
  children: React.ReactNode;
  tone?: "light" | "dark";
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold",
        tone === "light"
          ? "bg-orange-100 border border-orange-200 text-orange-700"
          : "bg-white/10 border border-white/15 text-orange-300"
      )}
    >
      {Icon && <Icon className="w-4 h-4" />}
      {children}
    </span>
  );
}

export function SectionHeader({
  badge,
  badgeIcon,
  title,
  accent,
  subtitle,
  align = "center",
  tone = "light",
}: {
  badge?: string;
  badgeIcon?: LucideIcon;
  title: string;
  accent?: string;
  subtitle?: React.ReactNode;
  align?: "center" | "left";
  tone?: "light" | "dark";
}) {
  return (
    <Reveal className={cn("mb-12 lg:mb-14", align === "center" ? "text-center max-w-3xl mx-auto" : "max-w-3xl")}>
      {badge && (
        <div className="mb-6">
          <Badge icon={badgeIcon} tone={tone}>{badge}</Badge>
        </div>
      )}
      <h2 className={cn("text-3xl md:text-4xl font-bold tracking-tight mb-4", tone === "light" ? "text-gray-900" : "text-white")}>
        {title}
        {accent && <> <span className="text-orange-500">{accent}</span></>}
      </h2>
      {subtitle && (
        <p className={cn("text-lg leading-relaxed", tone === "light" ? "text-gray-600" : "text-gray-400")}>{subtitle}</p>
      )}
    </Reveal>
  );
}

// Botón-enlace con el estilo del CTAButton francés
export function ButtonLink({
  href,
  children,
  variant = "primary",
  size = "default",
  location,
  className,
}: {
  href: string;
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "dark" | "ghostDark";
  size?: "default" | "large";
  location?: string;
  className?: string;
}) {
  return (
    <Link
      href={href}
      onClick={() => location && trackCTAClick(location)}
      className={cn(
        "group inline-flex items-center justify-center gap-2.5 font-semibold rounded-full transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-orange-500",
        {
          "bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white shadow-lg shadow-orange-500/25 hover:shadow-xl hover:shadow-orange-500/30 hover:-translate-y-0.5":
            variant === "primary",
          "bg-white hover:bg-gray-50 text-gray-900 border-2 border-gray-200 hover:border-gray-300 shadow-sm hover:shadow-md":
            variant === "secondary",
          "bg-gray-900 hover:bg-gray-800 text-white shadow-xl": variant === "dark",
          "bg-white/5 hover:bg-white/10 text-white border border-white/15 hover:border-white/30": variant === "ghostDark",
          "px-6 py-3 text-sm": size === "default",
          "px-8 py-4 text-base": size === "large",
        },
        className
      )}
    >
      <span>{children}</span>
      <ArrowRight className={cn("transition-transform duration-300 group-hover:translate-x-1", size === "default" ? "w-4 h-4" : "w-5 h-5")} />
    </Link>
  );
}
