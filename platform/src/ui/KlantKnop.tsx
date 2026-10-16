import { useRef } from 'react';
import { DEMO_FORMS } from '../demo/formulieren';
import { level6 } from '../lib/levels/level6';
import type { FileWrite, FormStep } from '../lib/levels/types';
import type { RepoSnapshot } from '../lib/repo/types';
import { FormStap } from './FormStap';

const klantStap = level6.steps.find((s): s is FormStep => s.id === 'l6-klant' && s.kind === 'form')!;

/**
 * De knop "Ik heb een klant", vanaf level 1. Je eerste klant kan op elk moment komen;
 * zodra hij in klanten.md staat, gaat level 6 open.
 */
export function KlantKnop({ snapshot, onSave }: { snapshot: RepoSnapshot; onSave: (w: FileWrite) => Promise<boolean> }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const title = useRef<HTMLHeadingElement>(null);
  const save = async (w: FileWrite) => {
    const ok = await onSave(w);
    if (ok) dialog.current?.close();
    return ok;
  };
  return (
    <div className="klant-balk">
      <span>Kocht iemand al iets van je?</span>
      <button
        ref={trigger}
        type="button"
        className="btn-o btn-klein"
        aria-haspopup="dialog"
        aria-controls="popup-klant"
        onClick={() => {
          dialog.current?.showModal();
          title.current?.focus();
        }}
      >
        Ik heb een klant
      </button>
      <dialog
        id="popup-klant"
        ref={dialog}
        className="popup"
        aria-labelledby="popup-klant-titel"
        onClose={() => trigger.current?.focus()}
        onClick={(e) => {
          if (e.target === dialog.current) dialog.current.close();
        }}
      >
        <div className="popup-inhoud">
          <h2 id="popup-klant-titel" ref={title} tabIndex={-1} className="popup-titel">
            Je eerste klant
          </h2>
          <p className="mt-3 text-[var(--text-secondary)]">
            Gefeliciteerd. Zet je klant in je repo, met een rol en initialen. Daarmee gaat level 6 open, ook als je eerdere levels nog niet af zijn.
          </p>
          <FormStap step={klantStap} snapshot={snapshot} alreadyDone={false} onSave={save} demoWaarden={DEMO_FORMS['l6-klant'](snapshot)} />
          <button type="button" className="btn-o btn-klein mt-4" onClick={() => dialog.current?.close()}>
            Sluiten
          </button>
        </div>
      </dialog>
    </div>
  );
}
