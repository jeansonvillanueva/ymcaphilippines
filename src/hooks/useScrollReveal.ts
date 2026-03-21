import { useEffect, useRef } from 'react';
import type { RefObject } from 'react';

const REVEAL_CLASS = 'reveal--visible';
const ROOT_MARGIN = '0px 0px -60px 0px';
const THRESHOLD = 0.1;

export function useScrollReveal<T extends HTMLElement>(): RefObject<T | null> {
  const ref = useRef<T>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add(REVEAL_CLASS);
          }
        });
      },
      { rootMargin: ROOT_MARGIN, threshold: THRESHOLD }
    );

    const targets = el.querySelectorAll('.reveal');
    targets.forEach((target) => observer.observe(target));

    return () => {
      targets.forEach((target) => observer.unobserve(target));
    };
  }, []);

  return ref as RefObject<T | null>;
}
