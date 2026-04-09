'use client';

import { useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import RevealOnScroll from '@/components/ui/RevealOnScroll';
import GlassCard from '@/components/ui/GlassCard';

gsap.registerPlugin(ScrollTrigger, useGSAP);

const HEADING_WORDS = ['Liberdade', 'para', 'criar.'];

export default function About() {
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);

  useGSAP(() => {
    if (!headingRef.current) return;
    const words = headingRef.current.querySelectorAll('.about-word');
    gsap.from(words, {
      y: 70,
      opacity: 0,
      stagger: 0.12,
      duration: 1,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: headingRef.current,
        start: 'top 82%',
        toggleActions: 'play none none none',
      },
    });
  }, { scope: sectionRef });

  return (
    <section
      ref={sectionRef}
      id="sobre"
      style={{
        background: 'var(--color-bg-secondary)',
        padding: 'clamp(5rem, 12vw, 11rem) 0',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <div
        className="orb"
        style={{
          width: '800px',
          height: '800px',
          background: 'radial-gradient(circle, rgba(232, 241, 248, 0.65) 0%, transparent 70%)',
          top: '-200px',
          left: '5%',
          animationDuration: '24s',
        }}
      />
      <div
        className="orb"
        style={{
          width: '400px',
          height: '400px',
          background: 'radial-gradient(circle, rgba(91, 141, 191, 0.08) 0%, transparent 70%)',
          bottom: '0px',
          right: '10%',
          animationDuration: '18s',
          animationDelay: '8s',
        }}
      />

      <div
        style={{
          position: 'relative',
          maxWidth: '80rem',
          margin: '0 auto',
          padding: '0 1.5rem',
        }}
      >
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(12, minmax(0, 1fr))',
            gap: 'clamp(2rem, 5vw, 5rem)',
            alignItems: 'center',
          }}
          className="about-grid"
        >
          <div className="about-col-heading">
            <h2
              ref={headingRef}
              aria-label="Liberdade para criar."
              style={{
                fontFamily: 'var(--font-heading)',
                fontSize: 'clamp(2.8rem, 5.5vw, 5rem)',
                fontWeight: 700,
                color: 'var(--color-text-primary)',
                lineHeight: 1.05,
                letterSpacing: '-0.03em',
              }}
            >
              {HEADING_WORDS.map((word, i) => (
                <span
                  key={i}
                  className="about-word"
                  aria-hidden="true"
                  style={{ display: 'block' }}
                >
                  {word}
                </span>
              ))}
            </h2>
          </div>

          <div
            className="about-col-content"
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '2rem',
            }}
          >
            <RevealOnScroll delay={0.15}>
              <p
                style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: 'clamp(1rem, 1.25vw, 1.2rem)',
                  color: 'var(--color-text-secondary)',
                  lineHeight: 1.85,
                  fontWeight: 400,
                }}
              >
                Acreditamos que um site vai além do código — é onde histórias ganham vida,
                conexões se formam e negócios crescem. Combinamos design preciso com
                desenvolvimento robusto para criar experiências digitais que ficam na memória.
              </p>
            </RevealOnScroll>

            <RevealOnScroll delay={0.3}>
              <GlassCard variant="strong" style={{ padding: 'clamp(2rem, 3vw, 2.5rem)' }}>
                <div
                  style={{
                    width: '32px',
                    height: '2px',
                    background: 'var(--color-accent)',
                    marginBottom: '1.5rem',
                  }}
                />
                <p
                  style={{
                    fontFamily: 'var(--font-heading)',
                    fontSize: 'clamp(1rem, 1.4vw, 1.3rem)',
                    color: 'var(--color-text-primary)',
                    lineHeight: 1.65,
                    letterSpacing: '-0.01em',
                    fontWeight: 400,
                    fontStyle: 'italic',
                  }}
                >
                  "Design é a ponte entre visão e realidade.
                  <br />Nós construímos essa ponte."
                </p>
              </GlassCard>
            </RevealOnScroll>
          </div>
        </div>
      </div>
    </section>
  );
}
