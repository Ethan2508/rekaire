// ============================================
// REKAIRE ES - Footer
// ============================================

import Link from "next/link";
import Image from "next/image";
import { Mail, ArrowUpRight, FileCheck2, Factory, Award, Globe } from "lucide-react";
import { siteEs, proFormHref } from "@/config/es/site";
import { publishedLandings } from "@/config/es/landings";

const columns = [
  {
    title: "Producto",
    links: [
      { href: "/rk01", label: "RK01" },
      { href: "/rk01#funcionamiento", label: "Funcionamiento" },
      { href: "/rk01#dimensionamiento", label: "Dimensionamiento" },
      { href: "/preguntas-frecuentes", label: "Preguntas frecuentes" },
    ],
  },
  {
    title: "Profesionales",
    links: [
      { href: "/profesionales", label: "Instaladores e ingenierías" },
      { href: "/documentacion", label: "Documentación técnica" },
      { href: "/normativa", label: "Normativa" },
      { href: proFormHref("distribuidor"), label: "Distribuidores" },
    ],
  },
  {
    title: "Aplicaciones",
    links: publishedLandings.map((l) => ({ href: `/${l.slug}`, label: l.navLabel })),
  },
  {
    title: "Empresa",
    links: [
      { href: "/sobre-nosotros", label: "Sobre nosotros" },
      { href: "/contacto", label: "Contacto" },
      { href: "/aviso-legal", label: "Aviso legal" },
      { href: "/politica-de-privacidad", label: "Privacidad" },
      { href: "/politica-de-cookies", label: "Cookies" },
    ],
  },
];

export function FooterEs() {
  return (
    <footer className="relative bg-gray-50 text-gray-900 overflow-hidden border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-8">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-8 lg:gap-10">
          <div className="col-span-2 md:col-span-4 lg:col-span-2">
            <Link href="/" className="inline-block mb-5 group">
              <Image
                src="/logo.png"
                alt="Rekaire"
                width={156}
                height={45}
                className="h-10 w-auto transition-transform duration-300 group-hover:scale-105"
              />
            </Link>
            <p className="text-gray-500 text-sm mb-5 max-w-xs leading-relaxed">
              Protección automática localizada para cuadros y armarios eléctricos, directamente en el origen del riesgo.
            </p>
            <a
              href={`mailto:${siteEs.contact.email}`}
              className="inline-flex items-center gap-2 text-gray-600 hover:text-orange-500 transition-colors text-sm group"
            >
              <Mail className="w-4 h-4" />
              <span>{siteEs.contact.email}</span>
              <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
            </a>
            <ul className="mt-6 space-y-2 text-sm text-gray-600">
              <li className="flex items-center gap-2">
                <FileCheck2 className="w-4 h-4 text-orange-500" /> Documentación técnica bajo solicitud
              </li>
              <li className="flex items-center gap-2">
                <Factory className="w-4 h-4 text-orange-500" /> Atención a profesionales en toda España
              </li>
              <li className="flex items-center gap-2">
                <Award className="w-4 h-4 text-orange-500" /> Vida útil de 5 años
              </li>
            </ul>
          </div>

          {columns.map((col) => (
            <div key={col.title}>
              <h4 className="text-gray-900 font-semibold mb-5 text-sm">{col.title}</h4>
              <ul className="space-y-3">
                {col.links.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className="text-gray-500 hover:text-gray-900 transition-colors text-sm">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 pt-8 border-t border-gray-200 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-gray-400 text-xs">
            © {new Date().getFullYear()} Rekaire · {siteEs.company.legalName}. Todos los derechos reservados.
          </p>
          <a
            href={siteEs.frenchSiteUrl}
            hrefLang="fr"
            className="inline-flex items-center gap-2 text-gray-500 hover:text-orange-500 text-xs transition-colors"
          >
            <Globe className="w-3.5 h-3.5" />
            Version française · rekaire.fr
          </a>
        </div>
      </div>
    </footer>
  );
}
