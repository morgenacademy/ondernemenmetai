import { marked } from 'marked';

/** Rendert uitleg uit content/levels. Die tekst komt uit deze repo en is dus vertrouwd. */
export function Markdown({ text }: { text: string }) {
  const html = nieuwTabblad(marked.parse(text, { async: false }) as string);
  return <div className="prose-morgen" dangerouslySetInnerHTML={{ __html: html }} />;
}

/** Links naar buiten openen in een nieuw tabblad, zodat je deze pagina niet kwijtraakt. */
export function nieuwTabblad(html: string): string {
  return html.replace(/<a href="(https?:\/\/[^"]+)"(?![^>]*target=)/g, '<a href="$1" target="_blank" rel="noreferrer"');
}
