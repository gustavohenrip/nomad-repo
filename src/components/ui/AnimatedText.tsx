'use client';

import React, { useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrollTrigger, useGSAP);

type ValidTag = 'h1' | 'h2' | 'h3' | 'h4' | 'p' | 'span' | 'div';
type AnimationType = 'fadeUp' | 'fadeIn' | 'clipReveal';
type SplitType = 'chars' | 'words';

interface AnimatedTextProps {
  text: string;
  as?: ValidTag;
  splitBy?: SplitType;
  animation?: AnimationType;
  stagger?: number;
  duration?: number;
  ease?: string;
  className?: string;
  style?: React.CSSProperties;
  delay?: number;
  triggerStart?: string;
}

export default function AnimatedText({
  text,
  as = 'div',
  splitBy = 'words',
  animation = 'fadeUp',
  stagger = 0.08,
  duration = 0.9,
  ease = 'power3.out',
  className = '',
  style,
  delay = 0,
  triggerStart = 'top 85%',
}: AnimatedTextProps) {
  const containerRef = useRef<HTMLElement>(null);

  const units = splitBy === 'chars' ? text.split('') : text.split(' ');

  useGSAP(() => {
    if (!containerRef.current) return;
    const elements = containerRef.current.querySelectorAll('.anim-unit');

    const fromVars: gsap.TweenVars =
      animation === 'fadeUp'
        ? { y: 60, opacity: 0 }
        : animation === 'clipReveal'
        ? { clipPath: 'inset(0 0 100% 0)', opacity: 0 }
        : { opacity: 0 };

    gsap.from(elements, {
      ...fromVars,
      stagger,
      duration,
      ease,
      delay,
      scrollTrigger: {
        trigger: containerRef.current,
        start: triggerStart,
        toggleActions: 'play none none none',
      },
    });
  }, { scope: containerRef as React.RefObject<HTMLElement> });

  const children = units.map((unit, i) =>
    React.createElement(
      'span',
      {
        key: i,
        className: 'anim-unit inline-block',
        'aria-hidden': 'true',
      },
      splitBy === 'words' ? unit + (i < units.length - 1 ? '\u00A0' : '') : unit
    )
  );

  return React.createElement(
    as,
    { ref: containerRef, className, style, 'aria-label': text },
    ...children
  );
}
