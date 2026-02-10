"use client";

// ============================================
// REKAIRE - Cloudflare Turnstile CAPTCHA
// Mode invisible pour UX fluide
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
  const scriptLoadedRef = useRef(false);

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
    // Load Turnstile script if not already loaded
    if (!scriptLoadedRef.current && !window.turnstile) {
      scriptLoadedRef.current = true;
      
      window.onTurnstileLoad = () => {
        renderWidget();
      };

      const script = document.createElement("script");
      script.src = "https://challenges.cloudflare.com/turnstile/v0/api.js?onload=onTurnstileLoad";
      script.async = true;
      script.defer = true;
      document.head.appendChild(script);
    } else if (window.turnstile) {
      renderWidget();
    }

    return () => {
      if (widgetIdRef.current && window.turnstile) {
        try {
          window.turnstile.remove(widgetIdRef.current);
        } catch (e) {
          // Ignore cleanup errors
        }
      }
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
