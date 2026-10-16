import { useRef } from 'react';
import { stepContent } from '../lib/content';
import type { StepPopup } from '../lib/levels/types';
import { Markdown } from './Markdown';
import { TweePlekken } from './TweePlekken';

/**
 * Knop met een pop-up voor extra uitleg. Gebruikt <dialog>: Esc sluit hem, de focus blijft erin
 * zolang hij open is, en gaat daarna terug naar de knop.
 */
export function InfoPopup({ levelId, popup }: { levelId: number; popup: StepPopup }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const title = useRef<HTMLHeadingElement>(null);
  const id = `popup-${popup.contentId}`;
  return (
    <>
      <button
        ref={trigger}
        type="button"
        className="btn-o btn-klein mt-4"
        aria-haspopup="dialog"
        aria-controls={id}
        onClick={() => {
          dialog.current?.showModal();
          // Begin bovenaan: anders springt de focus naar Sluiten en scrolt de pop-up op een telefoon naar beneden.
          title.current?.focus();
        }}
      >
        {popup.label}
      </button>
      <dialog
        id={id}
        ref={dialog}
        className="popup"
        aria-labelledby={`${id}-titel`}
        onClose={() => trigger.current?.focus()}
        onClick={(e) => {
          if (e.target === dialog.current) dialog.current.close();
        }}
      >
        <div className="popup-inhoud">
          <h2 id={`${id}-titel`} ref={title} tabIndex={-1} className="popup-titel">
            {popup.title}
          </h2>
          {popup.plaatje === 'twee-plekken' && <TweePlekken level={levelId} />}
          <Markdown text={stepContent(levelId, popup.contentId) ?? ''} />
          <button type="button" className="btn-p mt-6" onClick={() => dialog.current?.close()}>
            Sluiten
          </button>
        </div>
      </dialog>
    </>
  );
}
