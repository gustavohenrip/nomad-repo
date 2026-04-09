'use client';

import { useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import GlassCard from '@/components/ui/GlassCard';
import RevealOnScroll from '@/components/ui/RevealOnScroll';
import { PROCESS_STEPS } from '@/lib/constants';

gsap.registerPlugin(ScrollTrigger, useGSAP);

export default function Process() {
  const sectionRef = useRef<HTMLElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (!lineRef.current || !sectionRef.current) return;

    gsap.from(lineRef.current, {
      scaleY: 0,
      transformOrigin: 'top center',
      ease: 'none',
      scrollTrigger: {
        trigger: sectionRef.current,
        start: 'top 70%',
        end: 'bottom 30%',
        scrub: 1,
      },
    });

    gsap.utils.toArray<HTMLElement>('.process-step').forEach((step, i) => {
      gsap.from(step, {
        x: i % 2 === 0 ? -70 : 70,
        opacity: 0,
        duration: 0.9,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: step,
          start: 'top 82%',
          toggleActions: 'play none none none',
        },
      });
    });
  }, { scope: sectionRef });

  return (
    <section
      ref={sectionRef}
      id="processo"
      style={{
        background: 'linear-gradient(180deg, var(--color-bg-secondary) 0%, var(--color-bg-primary) 100%)',
        padding: 'clamp(5rem, 12vw, 11rem) 0',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <div
        className="orb"
        style={{
          width: '500px',
          height: '500px',
          background: 'radial-gradient(circle, rgba(91, 141, 191, 0.07) 0%, transparent 70%)',
          top: '20%',
          right: '-80px',
          animationDuration: '20s',
        }}
      />

      <div style={{ maxWidth: '80rem', margin: '0 auto', padding: '0 1.5rem' }}>
        <RevealOnScroll>
          <span
            style={{
              display: 'block',
              fontFamily: 'var(--font-body)',
              fontSize: '0.7rem',
              letterSpacing: '0.25em',
              textTransform: 'uppercase',
              color: 'var(--color-accent)',
              marginBottom: '1rem',
              fontWeight: 500,
              textAlign: 'center',
            }}
          >
            Processo
          </span>
        </RevealOnScroll>

        <RevealOnScroll delay={0.1}>
          <h2
            style={{
              fontFamily: 'var(--font-heading)',
              fontSize: 'clamp(2.5rem, 5vw, 4.5rem)',
              fontWeight: 700,
              color: 'var(--color-text-primary)',
              letterSpacing: '-0.02em',
              lineHeight: 1.05,
              textAlign: 'center',
              marginBottom: 'clamp(4rem, 8vw, 7rem)',
            }}
          >
            Como trabalhamos.
          </h2>
        </RevealOnScroll>

        <div
          className="process-timeline"
          style={{
            position: 'relative',
            maxWidth: '860px',
            margin: '0 auto',
          }}
        >
          <div
            ref={lineRef}
            className="process-line"
            style={{
              position: 'absolute',
              left: '50%',
              top: 0,
              bottom: 0,
              width: '1px',
              background: 'linear-gradient(to bottom, var(--color-accent), transparent)',
              transform: 'translateX(-50%)',
            }}
          />

          {PROCESS_STEPS.map((step, i) => (
            <div
              key={step.number}
              className={`process-step process-step-${i % 2 === 0 ? 'left' : 'right'}`}
              style={{
                paddingBottom: 'clamp(2rem, 6vw, 5.5rem)',
                position: 'relative',
              }}
            >
              <div
                className="process-dot"
                style={{
                  position: 'absolute',
                  left: '50%',
                  top: '2.5rem',
                  transform: 'translateX(-50%)',
                  width: '10px',
                  height: '10px',
                  borderRadius: '50%',
                  background: 'var(--color-accent)',
                  boxShadow: '0 0 0 4px var(--color-accent-light)',
                  zIndex: 2,
                }}
              />

              <GlassCard
                variant="default"
                className="process-card"
                style={{
                  padding: 'clamp(1.5rem, 3vw, 2.5rem)',
                }}
              >
                <span
                  style={{
                    display: 'block',
                    fontFamily: 'var(--font-heading)',
                    fontSize: 'clamp(2.5rem, 4vw, 3.5rem)',
                    fontWeight: 300,
                    color: 'rgba(91, 141, 191, 0.2)',
                    lineHeight: 1,
                    marginBottom: '1rem',
                    letterSpacing: '-0.02em',
                  }}
                >
                  {step.number}
                </span>
                <h3
                  style={{
                    fontFamily: 'var(--font-heading)',
                    fontSize: 'clamp(1.25rem, 1.8vw, 1.6rem)',
                    fontWeight: 700,
                    color: 'var(--color-text-primary)',
                    letterSpacing: '-0.02em',
                    marginBottom: '0.75rem',
                  }}
                >
                  {step.title}
                </h3>
                <p
                  style={{
                    fontFamily: 'var(--font-body)',
                    fontSize: 'clamp(0.875rem, 1.1vw, 1rem)',
                    color: 'var(--color-text-secondary)',
                    lineHeight: 1.75,
                  }}
                >
                  {step.description}
                </p>
              </GlassCard>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
