// ============================================
// REKAIRE ES - Política de privacidad (RGPD / LOPDGDD)
// ============================================

import type { Metadata } from "next";
import { LegalPageEs } from "@/components/es/legal-page";
import { siteEs } from "@/config/es/site";
import { hreflangAlternates } from "@/config/sites";

export const metadata: Metadata = {
  title: "Política de privacidad",
  description: "Cómo trata Rekaire los datos personales recogidos en rekaire.es.",
  alternates: hreflangAlternates("es", "/politica-de-privacidad"),
};

export default function PrivacidadPage() {
  const c = siteEs.company;
  return (
    <LegalPageEs title="Política de privacidad" updated="septiembre de 2026">
      <section>
        <h2>1. Responsable del tratamiento</h2>
        <p>
          {c.legalName} (marca {c.name}), {c.rcs}, NIF-IVA {c.tva}. Contacto:{" "}
          <a href={`mailto:${siteEs.contact.email}`}>{siteEs.contact.email}</a>.
        </p>
      </section>
      <section>
        <h2>2. Datos que tratamos</h2>
        <p>A través de los formularios de rekaire.es recogemos:</p>
        <ul>
          <li>Datos de identificación y contacto: nombre, empresa, teléfono, email, provincia y actividad.</li>
          <li>Datos del proyecto: número aproximado de cuadros, dimensiones y el contenido de tu mensaje.</li>
          <li>Datos técnicos de la conexión (dirección IP) con fines de seguridad y prevención del spam.</li>
        </ul>
      </section>
      <section>
        <h2>3. Finalidades y base jurídica</h2>
        <ul>
          <li>Responder a tus solicitudes y enviarte información o presupuestos: tu consentimiento y la aplicación de medidas precontractuales (art. 6.1.a y 6.1.b RGPD).</li>
          <li>Proteger el sitio frente a usos abusivos y spam: interés legítimo (art. 6.1.f RGPD).</li>
          <li>Medición de audiencia y de campañas publicitarias, solo si lo aceptas en el panel de cookies: consentimiento (art. 6.1.a RGPD).</li>
        </ul>
      </section>
      <section>
        <h2>4. Destinatarios y encargados del tratamiento</h2>
        <p>No cedemos tus datos a terceros salvo obligación legal. Utilizamos los siguientes proveedores:</p>
        <ul>
          <li>Vercel Inc. – alojamiento del sitio web.</li>
          <li>Resend – envío de los emails generados por los formularios.</li>
          <li>Cloudflare (Turnstile) – verificación antispam de los formularios.</li>
          <li>Google (Analytics y Ads) – medición de audiencia y publicidad, solo con tu consentimiento.</li>
          <li>Sentry – detección de errores técnicos del sitio.</li>
        </ul>
        <p>
          Algunos de estos proveedores pueden tratar datos fuera del Espacio Económico Europeo; en ese caso, las transferencias se amparan
          en las garantías previstas por el RGPD (decisiones de adecuación o cláusulas contractuales tipo).
        </p>
      </section>
      <section>
        <h2>5. Conservación</h2>
        <p>
          Conservamos los datos de las solicitudes durante el tiempo necesario para atenderlas y, en su caso, durante la relación comercial
          y los plazos legales aplicables. Después se suprimen o se bloquean conforme a la normativa.
        </p>
      </section>
      <section>
        <h2>6. Tus derechos</h2>
        <p>
          Puedes ejercer tus derechos de acceso, rectificación, supresión, oposición, limitación del tratamiento y portabilidad, así como
          retirar tu consentimiento en cualquier momento, escribiendo a <a href={`mailto:${siteEs.contact.email}`}>{siteEs.contact.email}</a>.
        </p>
        <p>
          Si consideras que el tratamiento no se ajusta a la normativa, puedes presentar una reclamación ante la Agencia Española de
          Protección de Datos (<a href="https://www.aepd.es" target="_blank" rel="noopener noreferrer">www.aepd.es</a>) o ante la
          autoridad de control francesa, la CNIL (<a href="https://www.cnil.fr" target="_blank" rel="noopener noreferrer">www.cnil.fr</a>).
        </p>
      </section>
    </LegalPageEs>
  );
}
