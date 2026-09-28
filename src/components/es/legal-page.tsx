// ============================================
// REKAIRE ES - Plantilla de páginas legales
// ============================================

import { HeaderEs } from "./header-es";
import { FooterEs } from "./footer-es";

export function LegalPageEs({ title, updated, children }: { title: string; updated: string; children: React.ReactNode }) {
  return (
    <>
      <HeaderEs />
      <main className="bg-white pt-32 lg:pt-40 pb-20 lg:pb-28">
        <article className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 tracking-tight">{title}</h1>
          <p className="mt-3 text-sm text-gray-500">Última actualización: {updated}</p>
          <div className="mt-10 space-y-8 text-gray-700 leading-relaxed [&_h2]:text-xl [&_h2]:font-bold [&_h2]:text-gray-900 [&_h2]:mb-3 [&_a]:text-orange-600 [&_a]:underline [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:space-y-1 [&_table]:w-full [&_table]:text-sm [&_th]:text-left [&_th]:py-2 [&_th]:pr-4 [&_td]:py-2 [&_td]:pr-4 [&_td]:align-top [&_tr]:border-b [&_tr]:border-gray-100">
            {children}
          </div>
        </article>
      </main>
      <FooterEs />
    </>
  );
}
