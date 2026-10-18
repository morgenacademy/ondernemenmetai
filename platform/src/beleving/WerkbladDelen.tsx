import { forwardRef, type ReactNode } from 'react';
import { demoVoorStap } from '../demo/vullen';
import { filterVariants, setupFrom, stepContent } from '../lib/content';
import type { Step } from '../lib/levels/types';
import type { RepoSnapshot } from '../lib/repo/types';
import { Markdown } from '../ui/Markdown';

/** Het lichte werkblad: een kop, eventueel een teller met balk, en wat erop staat. */
export const WerkbladKader = forwardRef<
  HTMLHeadingElement,
  { id: string; naam: string; teller?: ReactNode; deel?: number; children: ReactNode }
>(function WerkbladKader({ id, naam, teller, deel, children }, kop) {
  return (
    <section className="bl-werkblad" aria-labelledby={`wb-${id}`}>
      <div className="bl-wb-kop">
        <h3 id={`wb-${id}`} ref={kop} tabIndex={-1}>
          {naam}
        </h3>
        {teller !== undefined && <div className="bl-wb-teller">{teller}</div>}
      </div>
      {deel !== undefined && (
        <div className="bl-wb-balk" aria-hidden="true">
          <i style={{ width: `${Math.min(1, deel) * 100}%` }} />
        </div>
      )}
      {children}
    </section>
  );
});

/** "Vul met demo content" bij een stap die normaal buiten het platform gebeurt. */
export function DemoRegel({ step, onDemo }: { step: Step; onDemo: () => void }) {
  const demo = demoVoorStap(step);
  if (demo?.soort !== 'simulatie') return null;
  return (
    <div className="bl-wb-demo">
      <button type="button" className="bl-knop-demo" onClick={onDemo}>
        Vul met demo content
      </button>
      <span>Demo: {demo.label}</span>
    </div>
  );
}

/** De uitleg bij een stap, ingeklapt: het werkblad zelf blijft rustig. */
export function Uitleg({ levelId, step, snapshot, kop = 'Meer uitleg' }: { levelId: number; step: Step; snapshot: RepoSnapshot; kop?: string }) {
  const content = stepContent(levelId, step.id);
  if (!content) return null;
  return (
    <details className="bl-wb-meer">
      <summary>{kop}</summary>
      <Markdown text={filterVariants(content, setupFrom(snapshot))} />
    </details>
  );
}
