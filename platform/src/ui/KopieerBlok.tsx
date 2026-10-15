import { useRef, useState } from 'react';

export function KopieerBlok({ prompt }: { prompt: string }) {
  const [state, setState] = useState<'idle' | 'ok' | 'fout'>('idle');
  const ref = useRef<HTMLTextAreaElement>(null);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(prompt);
      setState('ok');
    } catch {
      ref.current?.select();
      setState('fout');
    }
  };
  return (
    <div className="kopieer-blok">
      <p className="eyebrow">Vraag je AI</p>
      <textarea ref={ref} readOnly value={prompt} rows={3} className="kopieer-tekst" aria-label="Opdracht voor je AI" />
      <div className="mt-2 flex flex-wrap items-center gap-3">
        <button type="button" className="btn-o btn-klein" onClick={copy}>
          Kopieer
        </button>
        {state === 'ok' && <span className="text-sm">Gekopieerd. Plak het in je AI-tool.</span>}
        {state === 'fout' && <span className="text-sm">Kopiëren lukt hier niet. De tekst is geselecteerd: druk op Cmd+C of Ctrl+C.</span>}
      </div>
    </div>
  );
}
