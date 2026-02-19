'use client';

import RevealOnScroll from '@/components/ui/RevealOnScroll';
import GlassCard from '@/components/ui/GlassCard';

export default function Testimonials() {
  return (
    <section
      id="depoimentos"
      style={{
        background: 'var(--color-bg-secondary)',
        padding: 'clamp(5rem, 12vw, 11rem) 0',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'radial-gradient(ellipse at center, rgba(232, 241, 248, 0.6) 0%, transparent 70%)',
          pointerEvents: 'none',
        }}
      />

      <div
        style={{
          position: 'relative',
          maxWidth: '80rem',
          margin: '0 auto',
          padding: '0 1.5rem',
          textAlign: 'center',
        }}
      >
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
            }}
          >
            Depoimentos
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
              marginBottom: 'clamp(3rem, 6vw, 5rem)',
            }}
          >
            O que nossos clientes dizem.
          </h2>
        </RevealOnScroll>

        <RevealOnScroll delay={0.25} scale={0.96}>
          <GlassCard
            variant="strong"
            hover={false}
            style={{
              maxWidth: '640px',
              margin: '0 auto',
              padding: 'clamp(2.5rem, 5vw, 4rem)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '1.75rem',
            }}
          >
            <div
              style={{
                width: '48px',
                height: '48px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, var(--color-accent-light), var(--color-accent))',
                opacity: 0.3,
              }}
            />
            <p
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: 'clamp(1rem, 1.3vw, 1.15rem)',
                color: 'var(--color-text-secondary)',
                fontStyle: 'italic',
                lineHeight: 1.8,
                fontWeight: 400,
              }}
            >
              Em breve, histórias reais de clientes que transformaram seus negócios com a Nomad Soluções em Web.
            </p>
            <div
              style={{
                width: '40px',
                height: '1px',
                background: 'var(--color-accent)',
                opacity: 0.5,
              }}
            />
          </GlassCard>
        </RevealOnScroll>
      </div>
    </section>
  );
}
