// ============================================
// REKAIRE ES - Contacto
// ============================================

import type { Metadata } from "next";
import Link from "next/link";
import { Mail, Clock, FileCheck2, MessageSquare } from "lucide-react";
import { HeaderEs } from "@/components/es/header-es";
import { FooterEs } from "@/components/es/footer-es";
import { PageHeroEs } from "@/components/es/page-hero";
import { ProFormEs } from "@/components/es/pro-form";
import { siteEs } from "@/config/es/site";
import { hreflangAlternates } from "@/config/sites";

export const metadata: Metadata = {
  title: "Contacto",
  description: "Contacta con Rekaire España: presupuestos, dimensionamiento de la protección de cuadros eléctricos, documentación técnica y distribución.",
  alternates: hreflangAlternates("es", "/contacto"),
};

export default function ContactoPage() {
  return (
    <>
      <HeaderEs />
      <main>
        <PageHeroEs
          badge="Contacto"
          icon={MessageSquare}
          title="Hablar con nuestro equipo"
          intro="Presupuestos, dimensionamiento, documentación técnica o distribución: cuéntanos tu necesidad y te respondemos en 24 a 48 horas laborables."
        />
        <section className="pb-20 lg:pb-28 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid lg:grid-cols-5 gap-10 lg:gap-14">
            <div className="lg:col-span-3">
              <ProFormEs defaultType="contacto" />
            </div>
            <aside className="lg:col-span-2 space-y-4">
              <a
                href={`mailto:${siteEs.contact.email}`}
                className="flex items-center gap-4 rounded-2xl border border-gray-200 p-5 hover:border-orange-300 transition-colors"
              >
                <span className="w-12 h-12 rounded-xl bg-orange-50 border border-orange-200 flex items-center justify-center">
                  <Mail className="w-5 h-5 text-orange-500" />
                </span>
                <span>
                  <span className="block text-sm text-gray-500">Email</span>
                  <span className="block font-semibold text-gray-900">{siteEs.contact.email}</span>
                </span>
              </a>
              <div className="flex items-center gap-4 rounded-2xl border border-gray-200 p-5">
                <span className="w-12 h-12 rounded-xl bg-orange-50 border border-orange-200 flex items-center justify-center">
                  <Clock className="w-5 h-5 text-orange-500" />
                </span>
                <span>
                  <span className="block text-sm text-gray-500">Plazo de respuesta</span>
                  <span className="block font-semibold text-gray-900">24 a 48 horas laborables</span>
                </span>
              </div>
              <Link
                href="/documentacion"
                className="flex items-center gap-4 rounded-2xl bg-gray-900 p-5 text-white hover:bg-gray-800 transition-colors"
              >
                <span className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center">
                  <FileCheck2 className="w-5 h-5 text-orange-300" />
                </span>
                <span>
                  <span className="block text-sm text-gray-400">Profesionales</span>
                  <span className="block font-semibold">Documentación técnica del RK01</span>
                </span>
              </Link>
            </aside>
          </div>
        </section>
      </main>
      <FooterEs />
    </>
  );
}
