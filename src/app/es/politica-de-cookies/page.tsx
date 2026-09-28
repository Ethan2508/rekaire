// ============================================
// REKAIRE ES - Política de cookies
// ============================================

import type { Metadata } from "next";
import Link from "next/link";
import { LegalPageEs } from "@/components/es/legal-page";
import { siteEs } from "@/config/es/site";

export const metadata: Metadata = {
  title: "Política de cookies",
  description: "Información sobre las cookies utilizadas en rekaire.es y cómo configurarlas.",
  alternates: { canonical: "/politica-de-cookies" },
};

const cookies = [
  { name: "rekaire_cookie_consent / rekaire_cookie_preferences", owner: "Rekaire", type: "Técnica", purpose: "Guardar tu elección sobre las cookies (almacenamiento local del navegador).", duration: "Hasta que la borres" },
  { name: "rk_site_choice", owner: "Rekaire", type: "Técnica", purpose: "Recordar la versión del sitio (España o Francia) que has elegido.", duration: "1 año" },
  { name: "Cookies de Cloudflare Turnstile", owner: "Cloudflare", type: "Técnica", purpose: "Verificación antispam de los formularios.", duration: "Sesión" },
  { name: "_ga, _ga_*", owner: "Google", type: "Analítica", purpose: "Medición de audiencia (Google Analytics). Solo con tu consentimiento.", duration: "Hasta 2 años" },
  { name: "_gcl_au y cookies de Google Ads", owner: "Google", type: "Publicitaria", purpose: "Medición de las conversiones de nuestras campañas. Solo con tu consentimiento.", duration: "Hasta 90 días" },
];

export default function CookiesPage() {
  return (
    <LegalPageEs title="Política de cookies" updated="septiembre de 2026">
      <section>
        <h2>1. ¿Qué son las cookies?</h2>
        <p>
          Las cookies y tecnologías similares son archivos o datos que se almacenan en tu dispositivo al visitar un sitio web. Permiten que
          el sitio funcione y, si lo aceptas, medir su uso y la eficacia de nuestras campañas.
        </p>
      </section>
      <section>
        <h2>2. Cookies utilizadas</h2>
        <div className="overflow-x-auto">
          <table>
            <thead>
              <tr>
                <th>Cookie</th>
                <th>Titular</th>
                <th>Tipo</th>
                <th>Finalidad</th>
                <th>Duración</th>
              </tr>
            </thead>
            <tbody>
              {cookies.map((c) => (
                <tr key={c.name}>
                  <td className="font-mono text-xs">{c.name}</td>
                  <td>{c.owner}</td>
                  <td>{c.type}</td>
                  <td>{c.purpose}</td>
                  <td>{c.duration}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
      <section>
        <h2>3. Consentimiento y configuración</h2>
        <p>
          Las cookies analíticas y publicitarias solo se activan si las aceptas en el panel de cookies. Puedes aceptarlas, rechazarlas o
          configurarlas por categorías. Para cambiar tu elección, borra los datos de este sitio en tu navegador y el panel volverá a
          mostrarse; también puedes bloquear o eliminar las cookies desde la configuración de tu navegador.
        </p>
      </section>
      <section>
        <h2>4. Más información</h2>
        <p>
          Para cualquier consulta, escríbenos a <a href={`mailto:${siteEs.contact.email}`}>{siteEs.contact.email}</a>. Consulta también
          nuestra <Link href="/politica-de-privacidad">política de privacidad</Link>.
        </p>
      </section>
    </LegalPageEs>
  );
}
