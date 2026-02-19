import type Lenis from 'lenis';

let lenisInstance: Lenis | null = null;

export const setLenis = (instance: Lenis | null) => {
  lenisInstance = instance;
};

export const scrollTo = (target: string | number | HTMLElement) => {
  if (lenisInstance) {
    lenisInstance.scrollTo(target as string, { duration: 1.2 });
  } else if (typeof target === 'string') {
    const el = document.querySelector(target);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  }
};
