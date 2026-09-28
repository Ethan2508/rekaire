"use client";

// ============================================
// REKAIRE ES - Formulario profesional
// Envío a /api/contact (locale "es") con verificación Turnstile
// ============================================

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Send, Loader2, CheckCircle2, Camera } from "lucide-react";
import { Turnstile } from "@/components/turnstile";
import { requestTypes, type RequestType } from "@/config/es/site";
import { provinces, activities, panelRanges } from "@/config/es/form";

const emptyForm = {
  requestType: "proyecto" as RequestType,
  name: "",
  company: "",
  phone: "",
  email: "",
  province: "",
  activity: "",
  panels: "",
  panelSize: "",
  message: "",
  website: "", // honeypot
  consent: false,
};

const inputClass =
  "w-full px-4 py-3.5 rounded-xl border-2 border-gray-200 focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 outline-none transition-all bg-gray-50/50 hover:bg-white text-gray-900 placeholder:text-gray-400";
const labelClass = "block text-sm font-medium text-gray-700 mb-2";

export function ProFormEs({ defaultType = "proyecto" }: { defaultType?: RequestType }) {
  const [form, setForm] = useState({ ...emptyForm, requestType: defaultType });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [turnstileToken, setTurnstileToken] = useState("");
  const [turnstileKey, setTurnstileKey] = useState(0);
  const clearTurnstileToken = useCallback(() => setTurnstileToken(""), []);

  // Tipo de solicitud preseleccionado desde los CTA (?solicitud=documentacion)
  useEffect(() => {
    const type = new URLSearchParams(window.location.search).get("solicitud");
    if (type && type in requestTypes) {
      setForm((f) => ({ ...f, requestType: type as RequestType }));
    }
  }, []);

  const update = (field: keyof typeof emptyForm) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => setForm((f) => ({ ...f, [field]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, subject: requestTypes[form.requestType], locale: "es", turnstileToken }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Se ha producido un error. Inténtalo de nuevo.");
      }

      if (typeof window !== "undefined" && window.gtag) {
        window.gtag("event", "conversion", {
          send_to: "AW-17976614746/QhySCMKaqoocENq-9ftC",
          value: 15.0,
          currency: "EUR",
        });
      }
      setIsSubmitted(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Se ha producido un error. Inténtalo de nuevo.");
      setTurnstileKey((k) => k + 1);
    } finally {
      // El token se consume en el servidor, tanto si el envío tiene éxito como si no
      setTurnstileToken("");
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.97 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-gradient-to-br from-emerald-50 to-emerald-100/50 border border-emerald-200 rounded-3xl p-8 md:p-12 text-center"
        role="status"
      >
        <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl shadow-emerald-500/30">
          <CheckCircle2 className="w-8 h-8 text-white" />
        </div>
        <h3 className="text-2xl font-bold text-gray-900 mb-3">Solicitud enviada</h3>
        <p className="text-gray-600 mb-6">
          Gracias. Nuestro equipo estudiará tu solicitud y te responderá en un plazo de 24 a 48 horas laborables.
        </p>
        <button
          type="button"
          onClick={() => {
            setForm({ ...emptyForm, requestType: defaultType });
            setIsSubmitted(false);
          }}
          className="text-emerald-700 hover:text-emerald-800 font-semibold"
        >
          Enviar otra solicitud
        </button>
      </motion.div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white border border-gray-200/80 rounded-3xl p-6 md:p-8 shadow-xl shadow-gray-200/50 space-y-6">
      <div>
        <label htmlFor="requestType" className={labelClass}>Tipo de solicitud *</label>
        <select id="requestType" required value={form.requestType} onChange={update("requestType")} className={`${inputClass} cursor-pointer`}>
          {Object.entries(requestTypes).map(([value, label]) => (
            <option key={value} value={value}>{label}</option>
          ))}
        </select>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="name" className={labelClass}>Nombre y apellidos *</label>
          <input id="name" required autoComplete="name" value={form.name} onChange={update("name")} className={inputClass} />
        </div>
        <div>
          <label htmlFor="company" className={labelClass}>Empresa *</label>
          <input id="company" required autoComplete="organization" value={form.company} onChange={update("company")} className={inputClass} />
        </div>
        <div>
          <label htmlFor="phone" className={labelClass}>Teléfono *</label>
          <input id="phone" type="tel" required autoComplete="tel" value={form.phone} onChange={update("phone")} className={inputClass} placeholder="+34 600 000 000" />
        </div>
        <div>
          <label htmlFor="email" className={labelClass}>Email *</label>
          <input id="email" type="email" required autoComplete="email" value={form.email} onChange={update("email")} className={inputClass} />
        </div>
        <div>
          <label htmlFor="province" className={labelClass}>Provincia *</label>
          <select id="province" required value={form.province} onChange={update("province")} className={`${inputClass} cursor-pointer`}>
            <option value="">Selecciona</option>
            {provinces.map((p) => <option key={p} value={p}>{p}</option>)}
          </select>
        </div>
        <div>
          <label htmlFor="activity" className={labelClass}>Actividad *</label>
          <select id="activity" required value={form.activity} onChange={update("activity")} className={`${inputClass} cursor-pointer`}>
            <option value="">Selecciona</option>
            {activities.map((a) => <option key={a} value={a}>{a}</option>)}
          </select>
        </div>
        <div>
          <label htmlFor="panels" className={labelClass}>Número aproximado de cuadros</label>
          <select id="panels" value={form.panels} onChange={update("panels")} className={`${inputClass} cursor-pointer`}>
            <option value="">Selecciona</option>
            {panelRanges.map((r) => <option key={r} value={r}>{r}</option>)}
          </select>
        </div>
        <div>
          <label htmlFor="panelSize" className={labelClass}>Dimensiones / volumen del cuadro</label>
          <input id="panelSize" value={form.panelSize} onChange={update("panelSize")} className={inputClass} placeholder="p. ej. 800 × 600 × 250 mm" />
        </div>
      </div>

      <div>
        <label htmlFor="message" className={labelClass}>Mensaje *</label>
        <textarea
          id="message"
          required
          minLength={10}
          rows={5}
          value={form.message}
          onChange={update("message")}
          className={`${inputClass} resize-none`}
          placeholder="Describe tu instalación o tu necesidad: tipo de cuadros, actividad, plazos…"
        />
        <p className="mt-2 text-xs text-gray-500 flex items-center gap-1.5">
          <Camera className="w-3.5 h-3.5" />
          ¿Tienes fotos de los cuadros? Indícalo y te diremos cómo enviárnoslas.
        </p>
      </div>

      {/* Honeypot : invisible para las personas */}
      <div className="absolute -left-[9999px]" aria-hidden="true">
        <label htmlFor="website">Web</label>
        <input id="website" tabIndex={-1} autoComplete="off" value={form.website} onChange={update("website")} />
      </div>

      <label className="flex items-start gap-3 text-sm text-gray-600 cursor-pointer">
        <input
          type="checkbox"
          required
          checked={form.consent}
          onChange={(e) => setForm((f) => ({ ...f, consent: e.target.checked }))}
          className="mt-1 w-4 h-4 rounded border-gray-300 text-orange-500 focus:ring-orange-500"
        />
        <span>
          He leído y acepto la{" "}
          <Link href="/politica-de-privacidad" className="text-orange-600 underline">política de privacidad</Link>. *
        </span>
      </label>

      {error && (
        <div className="bg-red-50 border-2 border-red-200 rounded-xl p-4 text-red-700 text-sm" role="alert">
          {error}
        </div>
      )}

      <Turnstile
        key={turnstileKey}
        siteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || "0x4AAAAAACaF8eEKeVuSgb_P"}
        onVerify={setTurnstileToken}
        onExpire={clearTurnstileToken}
        onError={clearTurnstileToken}
        action="es_pro_form"
        size="flexible"
        language="es"
      />

      <button
        type="submit"
        disabled={isSubmitting || !turnstileToken}
        className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 disabled:from-orange-300 disabled:to-orange-400 text-white font-semibold py-4 px-6 rounded-xl transition-all flex items-center justify-center gap-2 shadow-xl shadow-orange-500/25"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" /> Enviando…
          </>
        ) : (
          <>
            <Send className="w-5 h-5" /> Enviar solicitud
          </>
        )}
      </button>

      <p className="text-xs text-gray-500 leading-relaxed">
        <strong>Responsable:</strong> NELIOR SAS (Rekaire). <strong>Finalidad:</strong> responder a tu solicitud y, en su caso, enviarte un presupuesto.{" "}
        <strong>Legitimación:</strong> tu consentimiento y la aplicación de medidas precontractuales. <strong>Derechos:</strong> acceso, rectificación, supresión y otros, como se explica en la{" "}
        <Link href="/politica-de-privacidad" className="underline">política de privacidad</Link>.
      </p>
    </form>
  );
}
