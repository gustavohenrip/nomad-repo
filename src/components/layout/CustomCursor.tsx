'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

export default function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!dotRef.current || !ringRef.current) return;

    const dot = dotRef.current;
    const ring = ringRef.current;

    gsap.set([dot, ring], { xPercent: -50, yPercent: -50 });

    const onMouseMove = (e: MouseEvent) => {
      gsap.to(dot, {
        x: e.clientX,
        y: e.clientY,
        duration: 0.08,
        ease: 'power1.out',
      });
      gsap.to(ring, {
        x: e.clientX,
        y: e.clientY,
        duration: 0.5,
        ease: 'power2.out',
      });
    };

    const onEnter = () => {
      gsap.to(ring, { scale: 2.2, opacity: 0.6, duration: 0.3 });
      gsap.to(dot, { scale: 0, duration: 0.2 });
    };

    const onLeave = () => {
      gsap.to(ring, { scale: 1, opacity: 0.5, duration: 0.4 });
      gsap.to(dot, { scale: 1, duration: 0.3 });
    };

    const onIframeEnter = () => {
      gsap.to(dot, { opacity: 0, scale: 0, duration: 0.15 });
      gsap.to(ring, { opacity: 0, duration: 0.15 });
    };

    const onIframeLeave = () => {
      gsap.to(dot, { opacity: 1, scale: 1, duration: 0.2 });
      gsap.to(ring, { opacity: 0.5, scale: 1, duration: 0.2 });
    };

    document.addEventListener('mousemove', onMouseMove);

    const interactiveSelectors = 'a, button, [data-cursor-expand], input, textarea';

    const addListeners = () => {
      const els = document.querySelectorAll(interactiveSelectors);
      els.forEach(el => {
        el.addEventListener('mouseenter', onEnter);
        el.addEventListener('mouseleave', onLeave);
      });
      document.querySelectorAll('iframe').forEach(iframe => {
        iframe.addEventListener('mouseenter', onIframeEnter);
        iframe.addEventListener('mouseleave', onIframeLeave);
      });
    };

    addListeners();

    const observer = new MutationObserver(addListeners);
    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      document.removeEventListener('mousemove', onMouseMove);
      observer.disconnect();
    };
  }, []);

  return (
    <>
      <div
        ref={dotRef}
        className="custom-cursor"
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '8px',
          height: '8px',
          borderRadius: '50%',
          background: 'var(--color-accent)',
          pointerEvents: 'none',
          zIndex: 9999,
          mixBlendMode: 'normal',
        }}
      />
      <div
        ref={ringRef}
        className="custom-cursor"
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '36px',
          height: '36px',
          borderRadius: '50%',
          border: '1.5px solid var(--color-accent)',
          pointerEvents: 'none',
          zIndex: 9998,
          opacity: 0.5,
        }}
      />
    </>
  );
}
