// ============================================
// REKAIRE ES - Aviso legal (LSSI-CE)
// ============================================

import type { Metadata } from "next";
import { LegalPageEs } from "@/components/es/legal-page";
import { siteEs } from "@/config/es/site";
import { hreflangAlternates } from "@/config/sites";

export const metadata: Metadata = {
  title: "Aviso legal",
  description: "Aviso legal del sitio web rekaire.es.",
  alternates: hreflangAlternates("es", "/aviso-legal"),
};

export default function AvisoLegalPage() {
  const c = siteEs.company;
  return (
    <LegalPageEs title="Aviso legal" updated="septiembre de 2026">
      <section>
        <h2>1. Titular del sitio web</h2>
        <p>
          En cumplimiento de la Ley 34/2002, de 11 de julio, de servicios de la sociedad de la información y de comercio electrónico
          (LSSI-CE), se informa de que el sitio web rekaire.es es titularidad de:
        </p>
        <ul>
          <li><strong>Denominación social:</strong> {c.legalName} (marca comercial {c.name})</li>
          <li><strong>Domicilio social:</strong> {c.address}</li>
          <li><strong>Forma jurídica:</strong> sociedad por acciones simplificada (SAS) de derecho francés</li>
          <li><strong>Registro:</strong> Registre du Commerce et des Sociétés de {c.rcs}</li>
          <li><strong>SIREN:</strong> {c.siren} · <strong>SIRET:</strong> {c.siret}</li>
          <li><strong>NIF-IVA intracomunitario:</strong> {c.tva}</li>
          <li><strong>Capital social:</strong> {c.capital}</li>
          <li><strong>Email:</strong> <a href={`mailto:${siteEs.contact.email}`}>{siteEs.contact.email}</a></li>
        </ul>
      </section>
      <section>
        <h2>2. Alojamiento</h2>
        <p>{siteEs.hosting.provider} – {siteEs.hosting.address}</p>
      </section>
      <section>
        <h2>3. Objeto</h2>
        <p>
          El sitio web presenta los productos de protección contra incendios de la marca Rekaire y permite a los profesionales solicitar
          información, documentación técnica y presupuestos. El sitio no permite realizar compras en línea.
        </p>
      </section>
      <section>
        <h2>4. Propiedad intelectual e industrial</h2>
        <p>
          Los contenidos del sitio (textos, imágenes, esquemas, logotipos y marcas) son propiedad de {c.legalName} o se utilizan con
          autorización. Queda prohibida su reproducción, distribución o transformación sin autorización previa y por escrito.
        </p>
      </section>
      <section>
        <h2>5. Información técnica y normativa</h2>
        <p>
          La información técnica y normativa publicada tiene carácter divulgativo. No sustituye a los textos oficiales ni al estudio de
          cada instalación por un técnico competente. El dimensionamiento de la protección debe determinarse según las características de
          cada instalación.
        </p>
      </section>
      <section>
        <h2>6. Responsabilidad</h2>
        <p>
          {c.legalName} procura que la información del sitio sea exacta y esté actualizada, pero no garantiza la ausencia de errores ni de
          interrupciones del servicio. Los enlaces a sitios de terceros se facilitan a título informativo.
        </p>
      </section>
      <section>
        <h2>7. Legislación aplicable</h2>
        <p>
          Este aviso legal se rige por la legislación aplicable. En las relaciones con consumidores se respetarán los derechos que les
          reconoce la normativa de su lugar de residencia.
        </p>
      </section>
    </LegalPageEs>
  );
}
