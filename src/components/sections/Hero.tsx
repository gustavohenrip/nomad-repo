'use client';

import { useRef, useState, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { TAGLINES } from '@/lib/constants';
import PhysicsOrbs from '@/components/ui/PhysicsOrbs';

gsap.registerPlugin(ScrollTrigger, useGSAP);

const NOMAD_CHARS = ['N', 'O', 'M', 'A', 'D'];
const SUBTITLE_WORDS = ['Soluções', 'em', 'Web'];

export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [displayText, setDisplayText] = useState('');

  useEffect(() => {
    let currentIndex = 0;
    let timeoutId: ReturnType<typeof setTimeout>;
    let mounted = true;

    const animateCycle = () => {
      if (!mounted) return;
      const phrase = TAGLINES[currentIndex % TAGLINES.length];
      currentIndex++;
      let charIndex = 0;

      const type = () => {
        if (!mounted) return;
        if (charIndex <= phrase.length) {
          setDisplayText(phrase.slice(0, charIndex));
          charIndex++;
          timeoutId = setTimeout(type, 42);
        } else {
          timeoutId = setTimeout(erase, 2400);
        }
      };

      const erase = () => {
        if (!mounted) return;
        if (charIndex > 0) {
          charIndex--;
          setDisplayText(phrase.slice(0, charIndex));
          timeoutId = setTimeout(erase, 22);
        } else {
          timeoutId = setTimeout(animateCycle, 350);
        }
      };

      type();
    };

    const startDelay = setTimeout(animateCycle, 3400);

    return () => {
      mounted = false;
      clearTimeout(startDelay);
      clearTimeout(timeoutId);
    };
  }, []);

  useGSAP(() => {
    if (!sectionRef.current) return;

    const tl = gsap.timeline({ delay: 2.1 });

    tl.from('.hero-char', {
      y: 130,
      rotateX: -85,
      opacity: 0,
      stagger: 0.08,
      duration: 1.05,
      ease: 'power3.out',
    })
      .from('.hero-subtitle-word', {
        y: 35,
        opacity: 0,
        stagger: 0.1,
        duration: 0.8,
        ease: 'power2.out',
      }, '-=0.5')
      .from('.hero-tagline-wrap', {
        opacity: 0,
        y: 20,
        duration: 0.6,
        ease: 'power2.out',
      }, '-=0.3')
      .from('.hero-scroll-hint', {
        opacity: 0,
        y: 12,
        duration: 0.7,
        ease: 'power2.out',
      }, '-=0.1');

    gsap.to(contentRef.current, {
      opacity: 0,
      y: -60,
      scale: 1.05,
      ease: 'none',
      scrollTrigger: {
        trigger: sectionRef.current,
        start: 'top top',
        end: '+=400',
        scrub: 0.8,
      },
    });
  }, { scope: sectionRef });

  return (
    <section
      ref={sectionRef}
      id="hero"
      style={{
        height: '100svh',
        width: '100%',
        position: 'relative',
        overflow: 'hidden',
        background: 'linear-gradient(145deg, #F5F3F0 0%, #FAFAF8 40%, #EEF4FA 100%)',
      }}
    >
      <div
        className="orb"
        style={{
          width: '650px',
          height: '650px',
          background: 'radial-gradient(circle, rgba(91, 141, 191, 0.16) 0%, transparent 70%)',
          top: '-150px',
          right: '-80px',
          animationDuration: '28s',
        }}
      />
      <div
        className="orb"
        style={{
          width: '500px',
          height: '500px',
          background: 'radial-gradient(circle, rgba(232, 241, 248, 0.9) 0%, transparent 70%)',
          bottom: '-80px',
          left: '-60px',
          animationDuration: '20s',
          animationDelay: '6s',
        }}
      />
      <div
        className="orb"
        style={{
          width: '350px',
          height: '350px',
          background: 'radial-gradient(circle, rgba(74, 124, 158, 0.1) 0%, transparent 70%)',
          top: '30%',
          left: '15%',
          animationDuration: '16s',
          animationDelay: '3s',
        }}
      />

      <div style={{ position: 'absolute', inset: 0, zIndex: 0 }}>
        <PhysicsOrbs />
      </div>

      <div
        ref={contentRef}
        style={{
          position: 'relative',
          zIndex: 10,
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          padding: '0 1.5rem',
        }}
      >
        <div className="perspective-1000">
          <h1
            aria-label="NOMAD"
            style={{
              fontFamily: 'var(--font-heading)',
              fontWeight: 700,
              fontSize: 'clamp(5rem, 13vw, 15rem)',
              letterSpacing: '0.06em',
              color: 'var(--color-text-primary)',
              lineHeight: 0.95,
              display: 'flex',
              userSelect: 'none',
            }}
          >
            {NOMAD_CHARS.map((char, i) => (
              <span
                key={i}
                className="hero-char inline-block"
                aria-hidden="true"
                style={{ display: 'inline-block' }}
              >
                {char}
              </span>
            ))}
          </h1>
        </div>

        <div
          style={{
            marginTop: '1.25rem',
            overflow: 'hidden',
          }}
          aria-label="Soluções em Web"
        >
          <div
            style={{
              fontFamily: 'var(--font-body)',
              fontWeight: 300,
              fontSize: 'clamp(0.75rem, 1.8vw, 1.2rem)',
              letterSpacing: '0.32em',
              color: 'var(--color-text-secondary)',
              textTransform: 'uppercase',
              display: 'flex',
              gap: '0.8em',
            }}
          >
            {SUBTITLE_WORDS.map((word, i) => (
              <span
                key={i}
                className="hero-subtitle-word inline-block"
                aria-hidden="true"
              >
                {word}
              </span>
            ))}
          </div>
        </div>

        <div
          className="hero-tagline-wrap"
          style={{
            marginTop: '2rem',
            minHeight: '2rem',
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <span
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: 'clamp(0.875rem, 1.6vw, 1.15rem)',
              fontStyle: 'italic',
              fontWeight: 400,
              color: 'var(--color-text-muted)',
              letterSpacing: '0.02em',
            }}
          >
            {displayText}
          </span>
        </div>

        <div
          className="hero-scroll-hint"
          style={{
            position: 'absolute',
            bottom: '2.5rem',
            left: '50%',
            transform: 'translateX(-50%)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '0.75rem',
          }}
        >
          <span
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: '0.65rem',
              letterSpacing: '0.22em',
              textTransform: 'uppercase',
              color: 'var(--color-text-muted)',
            }}
          >
            Explorar
          </span>
          <div
            style={{
              width: '1px',
              height: '48px',
              background: 'linear-gradient(to bottom, var(--color-accent), transparent)',
            }}
            className="scroll-line-animate"
          />
        </div>
      </div>
    </section>
  );
}
