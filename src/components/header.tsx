"use client";

// ============================================
// REKAIRE - Header Component (Light Clean)
// ============================================

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { CTAButton } from "./cta-button";
import { Menu, X } from "lucide-react";

export interface NavLink {
  href: string;
  label: string;
  scrollToTop?: boolean;
}

const defaultNavLinks: NavLink[] = [
  { href: "/produit", label: "Notre solution", scrollToTop: true },
  { href: "/a-propos", label: "À propos" },
  { href: "/faq", label: "FAQ" },
  { href: "/blog", label: "Blog" },
  { href: "/contact", label: "Contact" },
];

interface HeaderProps {
  // Par défaut : navigation et CTA du site français
  navLinks?: NavLink[];
  renderCTA?: (placement: "desktop" | "mobile") => React.ReactNode;
  menuLabel?: string;
  // "auto" : sombre au-dessus des sections marquées data-header-theme="dark", clair ailleurs
  theme?: "light" | "dark" | "auto";
}

export function Header({ navLinks = defaultNavLinks, renderCTA, menuLabel = "Menu", theme = "light" }: HeaderProps = {}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [autoDark, setAutoDark] = useState(theme === "auto");
  const dark = theme === "dark" || (theme === "auto" && autoDark);

  // Thème automatique : quelle section se trouve sous le header ?
  useEffect(() => {
    if (theme !== "auto") return;
    const update = () => {
      const probeY = 40;
      const el = document.elementFromPoint(Math.min(window.innerWidth - 1, 8), probeY + 60);
      setAutoDark(!!el?.closest('[data-header-theme="dark"]'));
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [theme]);
  // Sur rekaire.es, les pages sont servies via le préfixe interne /es
  const pathname = usePathname()?.replace(/^\/es(?=\/|$)/, "") || "/";

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <motion.header
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          dark
            ? scrolled
              ? "bg-[#0b0b0c]/80 backdrop-blur-lg border-b border-white/10"
              : "bg-transparent"
            : scrolled
              ? "bg-white/95 backdrop-blur-lg border-b border-gray-200 shadow-sm"
              : "bg-white/80 backdrop-blur-sm"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-20">
            {/* Logo */}
            <Link href="/" className="flex items-center group">
              <Image
                src={dark ? "/logo-white.png" : "/logo.png"}
                alt="Rekaire"
                width={234}
                height={68}
                className="h-13 md:h-16 w-auto transition-transform duration-300 group-hover:scale-105"
                priority
              />
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-1">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={(e) => {
                      if (link.scrollToTop) {
                        e.preventDefault();
                        window.location.href = link.href;
                      }
                    }}
                    className={`relative px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                      isActive
                        ? dark ? "text-orange-400" : "text-orange-500"
                        : dark ? "text-gray-300 hover:text-white" : "text-gray-600 hover:text-gray-900"
                    }`}
                  >
                    {link.label}
                    {isActive && (
                      <motion.div
                        layoutId="activeNav"
                        className={`absolute inset-0 rounded-full -z-10 border ${dark ? "bg-orange-500/15 border-orange-500/30" : "bg-orange-100 border-orange-200"}`}
                        transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                      />
                    )}
                  </Link>
                );
              })}
            </nav>

            {/* Desktop CTA */}
            <div className="hidden lg:flex items-center">
              {renderCTA ? renderCTA("desktop") : <CTAButton location="header" size="default" />}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className={`lg:hidden w-10 h-10 rounded-lg flex items-center justify-center transition-colors ${dark ? "bg-white/10 text-white hover:bg-white/20" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}
              aria-label={menuLabel}
            >
              <AnimatePresence mode="wait">
                {mobileMenuOpen ? (
                  <motion.div
                    key="close"
                    initial={{ rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <X className="w-5 h-5" />
                  </motion.div>
                ) : (
                  <motion.div
                    key="menu"
                    initial={{ rotate: 90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: -90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Menu className="w-5 h-5" />
                  </motion.div>
                )}
              </AnimatePresence>
            </button>
          </div>
        </div>
      </motion.header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileMenuOpen(false)}
              className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm lg:hidden"
            />
            
            {/* Menu Panel */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="fixed inset-x-4 top-24 z-50 bg-white rounded-2xl border border-gray-200 shadow-xl overflow-hidden lg:hidden"
            >
              <nav className="p-4 space-y-1">
                {navLinks.map((link, index) => {
                  const isActive = pathname === link.href;
                  return (
                    <motion.div
                      key={link.href}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <Link
                        href={link.href}
                        onClick={(e) => {
                          setMobileMenuOpen(false);
                          if (link.scrollToTop) {
                            e.preventDefault();
                            window.location.href = link.href;
                          }
                        }}
                        className={`block px-4 py-3 rounded-xl text-base font-medium transition-all ${
                          isActive
                            ? "bg-orange-100 text-orange-600"
                            : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                        }`}
                      >
                        {link.label}
                      </Link>
                    </motion.div>
                  );
                })}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: navLinks.length * 0.05 }}
                  className="pt-4 border-t border-gray-200"
                >
                  {renderCTA ? renderCTA("mobile") : (
                    <CTAButton
                      location="header"
                      size="default"
                      className="w-full justify-center"
                    />
                  )}
                </motion.div>
              </nav>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
