"use client";

// ============================================
// REKAIRE - Cloudflare Turnstile CAPTCHA
// Mode flexible pour UX optimale
// ============================================

import { useEffect, useRef, useCallback } from "react";

interface TurnstileProps {
  siteKey: string;
  onVerify: (token: string) => void;
  onError?: () => void;
  onExpire?: () => void;
  action?: string;
  theme?: "light" | "dark" | "auto";
  size?: "normal" | "compact" | "flexible";
}

declare global {
  interface Window {
    turnstile?: {
      render: (container: string | HTMLElement, options: any) => string;
      reset: (widgetId: string) => void;
      remove: (widgetId: string) => void;
      execute: (container: string | HTMLElement, options?: any) => void;
    };
    onTurnstileLoad?: () => void;
  }
}

// Chargement unique du script, partagé entre tous les widgets de la page
let scriptPromise: Promise<void> | null = null;

function loadTurnstileScript(): Promise<void> {
  if (window.turnstile) return Promise.resolve();
  if (!scriptPromise) {
    scriptPromise = new Promise((resolve) => {
      window.onTurnstileLoad = () => resolve();
      const script = document.createElement("script");
      script.src = "https://challenges.cloudflare.com/turnstile/v0/api.js?onload=onTurnstileLoad";
      script.async = true;
      script.defer = true;
      script.onerror = () => {
        // Permettre une nouvelle tentative au prochain montage
        scriptPromise = null;
      };
      document.head.appendChild(script);
    });
  }
  return scriptPromise;
}

export function Turnstile({
  siteKey,
  onVerify,
  onError,
  onExpire,
  action = "lead_capture",
  theme = "auto",
  size = "flexible",
}: TurnstileProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const widgetIdRef = useRef<string | null>(null);

  const renderWidget = useCallback(() => {
    if (!containerRef.current || !window.turnstile) return;
    
    // Remove existing widget if any
    if (widgetIdRef.current) {
      try {
        window.turnstile.remove(widgetIdRef.current);
      } catch (e) {
        // Ignore
      }
    }

    widgetIdRef.current = window.turnstile.render(containerRef.current, {
      sitekey: siteKey,
      callback: (token: string) => {
        onVerify(token);
      },
      "error-callback": () => {
        console.error("Turnstile error");
        onError?.();
      },
      "expired-callback": () => {
        console.log("Turnstile token expired");
        onExpire?.();
      },
      action,
      theme,
      size,
    });
  }, [siteKey, onVerify, onError, onExpire, action, theme, size]);

  useEffect(() => {
    let cancelled = false;

    loadTurnstileScript().then(() => {
      if (!cancelled) renderWidget();
    });

    return () => {
      cancelled = true;
      if (widgetIdRef.current && window.turnstile) {
        try {
          window.turnstile.remove(widgetIdRef.current);
        } catch (e) {
          // Ignore cleanup errors
        }
      }
      widgetIdRef.current = null;
    };
  }, [renderWidget]);

  return <div ref={containerRef} />;
}

// Hook pour utiliser Turnstile de manière programmatique
export function useTurnstile() {
  const tokenRef = useRef<string | null>(null);

  const setToken = useCallback((token: string) => {
    tokenRef.current = token;
  }, []);

  const getToken = useCallback(() => {
    return tokenRef.current;
  }, []);

  const clearToken = useCallback(() => {
    tokenRef.current = null;
  }, []);

  return { setToken, getToken, clearToken };
}
