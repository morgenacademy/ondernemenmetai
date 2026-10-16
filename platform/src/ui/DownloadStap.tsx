import type { Setup } from '../lib/content';
import { DOWNLOADS } from '../lib/levels/level0';
import { ExternalIcon } from './icons';

/** Eén grote kaart voor de AI-app die bij je abonnement hoort; zonder (geldige) keuze staan ze er allebei. */
export function DownloadStap({ setup }: { setup: Setup }) {
  const chosen = DOWNLOADS.find((d) => d.ai === setup.ai);
  const downloads = chosen ? [chosen] : DOWNLOADS;
  return (
    <div className={`download-grid${downloads.length > 1 ? ' twee' : ''}`}>
      {downloads.map((d) => (
        <section key={d.ai} className="download-kaart" aria-labelledby={`download-${d.ai}`}>
          <p className="eyebrow">Bij je {d.account}-abonnement</p>
          <h3 id={`download-${d.ai}`} className="download-naam">
            {d.name}
          </h3>
          <ol className="download-stappen">
            {d.steps.map((s) => (
              <li key={s}>{s}</li>
            ))}
          </ol>
          <a className="btn-p" href={d.url} target="_blank" rel="noopener noreferrer">
            Download {d.name}
            <ExternalIcon />
            <span className="sr-only">(opent in een nieuw tabblad)</span>
          </a>
        </section>
      ))}
    </div>
  );
}
