import { useEffect, useRef } from 'react';

/**
 * Zet bl-zichtbaar op secties en op .bl-in-elementen zodra ze in beeld komen, zoals in de schetsen.
 * Zonder IntersectionObserver (oude browser, test) is alles meteen zichtbaar.
 */
export function useZichtbaar<T extends HTMLElement>(onZichtbaar?: (el: Element) => void) {
  const ref = useRef<T>(null);
  useEffect(() => {
    const wortel = ref.current;
    if (!wortel) return;
    const elementen = [...wortel.querySelectorAll('section, .bl-in')];
    if (typeof IntersectionObserver === 'undefined') {
      elementen.forEach((el) => el.classList.add('bl-zichtbaar'));
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
      { threshold: 0.2 },
    );
    elementen.forEach((el) => io.observe(el));
    return () => io.disconnect();
  });
  return ref;
}
