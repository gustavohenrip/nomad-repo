'use client';

import { useRef, useEffect } from 'react';
import { gsap } from 'gsap';

export default function Preloader() {
  const overlayRef = useRef<HTMLDivElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const tl = gsap.timeline();

    tl.from(lineRef.current, {
      scaleX: 0,
      transformOrigin: 'left center',
      duration: 1.4,
      ease: 'power2.inOut',
    })
      .to(dotRef.current, {
        scale: 1,
        opacity: 1,
        duration: 0.3,
        ease: 'back.out(2)',
      }, '-=0.1')
      .to(overlayRef.current, {
        yPercent: -100,
        duration: 0.9,
        ease: 'power3.inOut',
        delay: 0.15,
      })
      .set(overlayRef.current, { display: 'none' });
  }, []);

  return (
    <div ref={overlayRef} className="preloader">
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
        <div
          style={{
            width: '200px',
            height: '1px',
            background: 'var(--color-accent-light)',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <div
            ref={lineRef}
            style={{
              position: 'absolute',
              inset: 0,
              background: 'linear-gradient(to right, var(--color-accent), var(--color-accent-deep))',
              transformOrigin: 'left center',
            }}
          />
        </div>
        <div
          ref={dotRef}
          style={{
            width: '6px',
            height: '6px',
            borderRadius: '50%',
            background: 'var(--color-accent)',
            opacity: 0,
            scale: '0',
          }}
        />
      </div>
    </div>
  );
}
