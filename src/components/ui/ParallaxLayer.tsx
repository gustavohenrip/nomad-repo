'use client';

import { useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrollTrigger, useGSAP);

interface ParallaxLayerProps {
  children: React.ReactNode;
  speed?: number;
  className?: string;
  style?: React.CSSProperties;
}

export default function ParallaxLayer({
  children,
  speed = 0.1,
  className = '',
  style,
}: ParallaxLayerProps) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (!ref.current) return;
    gsap.to(ref.current, {
      y: () => speed * window.innerHeight * -0.5,
      ease: 'none',
      scrollTrigger: {
        trigger: ref.current,
        start: 'top bottom',
        end: 'bottom top',
        scrub: 0.6,
        invalidateOnRefresh: true,
      },
    });
  }, { scope: ref });

  return (
    <div ref={ref} className={className} style={{ willChange: 'transform', ...style }}>
      {children}
    </div>
  );
}
