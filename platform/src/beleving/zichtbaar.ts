import { useEffect, type RefObject } from 'react';

/**
 * Geeft elke sectie en elk element met .bl-in binnen de wortel de klasse bl-zichtbaar zodra hij in beeld komt.
 * Zonder IntersectionObserver (of in een test) is alles meteen zichtbaar.
 */
export function useZichtbaar(wortel: RefObject<HTMLElement | null>, opnieuw: unknown = null, onZichtbaar?: (el: Element) => void) {
  useEffect(() => {
    const el = wortel.current;
    if (!el) return;
    const doelen = [...el.querySelectorAll('section, .bl-in')];
    if (typeof IntersectionObserver === 'undefined') {
      doelen.forEach((d) => d.classList.add('bl-zichtbaar'));
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (!e.isIntersecting) continue;
          e.target.classList.add('bl-zichtbaar');
          onZichtbaar?.(e.target);
        }
      },
      { threshold: 0.3 },
    );
    doelen.forEach((d) => io.observe(d));
    return () => io.disconnect();
  }, [wortel, opnieuw, onZichtbaar]);
}
