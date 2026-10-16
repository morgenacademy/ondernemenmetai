import { marked } from 'marked';

/** Rendert uitleg uit content/levels. Die tekst komt uit deze repo en is dus vertrouwd. */
export function Markdown({ text }: { text: string }) {
  const html = marked.parse(text, { async: false }) as string;
  return <div className="prose-morgen" dangerouslySetInnerHTML={{ __html: html }} />;
}
