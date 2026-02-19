'use client';

import { useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import GlassCard from '@/components/ui/GlassCard';
import { SERVICES } from '@/lib/constants';

gsap.registerPlugin(ScrollTrigger, useGSAP);

export default function Services() {
  const sectionRef = useRef<HTMLElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (!cardsRef.current || !sectionRef.current) return;

    const cards = cardsRef.current;

    const getScrollAmount = () => {
      const cardsLeft = cards.offsetLeft;
      const cardsWidth = cards.scrollWidth;
      const viewportWidth = window.innerWidth;
      return -(cardsLeft + cardsWidth - viewportWidth);
    };

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: sectionRef.current,
        pin: true,
        anticipatePin: 1,
        start: 'top top',
        end: () => `+=${Math.abs(getScrollAmount())}`,
        scrub: 1,
        invalidateOnRefresh: true,
      },
    });

    tl.to(cards, {
      x: getScrollAmount,
      ease: 'none',
    });

    gsap.from(titleRef.current, {
      x: -50,
      opacity: 0,
      duration: 0.9,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: sectionRef.current,
        start: 'top 80%',
        toggleActions: 'play none none none',
      },
    });
  }, { scope: sectionRef });

  return (
    <section
      ref={sectionRef}
      id="servicos"
      style={{
        background: 'linear-gradient(155deg, var(--color-bg-primary) 0%, var(--color-accent-light) 100%)',
        overflowX: 'clip',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          height: '100vh',
          width: '100%',
          position: 'relative',
        }}
      >
        <div
          style={{
            position: 'absolute',
            left: 0,
            top: 0,
            bottom: 0,
            width: 'clamp(320px, 30vw, 460px)',
            background: 'linear-gradient(to right, var(--color-bg-primary) 0%, var(--color-bg-primary) 52%, rgba(245,243,240,0) 100%)',
            zIndex: 3,
            pointerEvents: 'none',
          }}
        />
        <div
          ref={titleRef}
          style={{
            position: 'absolute',
            left: 0,
            top: 0,
            bottom: 0,
            width: 'clamp(220px, 22vw, 340px)',
            paddingLeft: 'clamp(1.5rem, 5vw, 5rem)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            zIndex: 4,
          }}
        >
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
            Serviços
          </span>
          <h2
            style={{
              fontFamily: 'var(--font-heading)',
              fontSize: 'clamp(1.8rem, 3vw, 2.8rem)',
              fontWeight: 700,
              color: 'var(--color-text-primary)',
              lineHeight: 1.1,
              letterSpacing: '-0.02em',
            }}
          >
            O que<br />fazemos.
          </h2>
        </div>

        <div
          ref={cardsRef}
          className="no-scrollbar"
          style={{
            display: 'flex',
            gap: '1.5rem',
            paddingLeft: 'clamp(240px, 23vw, 360px)',
            paddingRight: '6rem',
            alignItems: 'center',
            flexShrink: 0,
          }}
        >
          {SERVICES.map((service) => (
            <GlassCard
              key={service.number}
              variant="strong"
              style={{
                width: 'clamp(300px, 28vw, 400px)',
                height: 'clamp(440px, 52vh, 540px)',
                flexShrink: 0,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                padding: 'clamp(1.75rem, 3vw, 2.75rem)',
              }}
            >
              <div>
                <span
                  style={{
                    display: 'block',
                    fontFamily: 'var(--font-heading)',
                    fontSize: 'clamp(3rem, 5vw, 5rem)',
                    fontWeight: 300,
                    color: 'rgba(91, 141, 191, 0.25)',
                    lineHeight: 1,
                    marginBottom: '1.5rem',
                    letterSpacing: '-0.02em',
                  }}
                >
                  {service.number}
                </span>
                <h3
                  style={{
                    fontFamily: 'var(--font-heading)',
                    fontSize: 'clamp(1.5rem, 2.2vw, 2rem)',
                    fontWeight: 700,
                    color: 'var(--color-text-primary)',
                    letterSpacing: '-0.02em',
                    marginBottom: '0.75rem',
                  }}
                >
                  {service.title}
                </h3>
                <p
                  style={{
                    fontFamily: 'var(--font-body)',
                    fontSize: 'clamp(0.95rem, 1.2vw, 1.05rem)',
                    color: 'var(--color-accent-deep)',
                    fontWeight: 500,
                    marginBottom: '1.25rem',
                    lineHeight: 1.5,
                  }}
                >
                  {service.description}
                </p>
                <p
                  style={{
                    fontFamily: 'var(--font-body)',
                    fontSize: 'clamp(0.85rem, 1vw, 0.95rem)',
                    color: 'var(--color-text-secondary)',
                    lineHeight: 1.75,
                  }}
                >
                  {service.detail}
                </p>
              </div>
              <div
                style={{
                  width: '36px',
                  height: '2px',
                  background: 'linear-gradient(to right, var(--color-accent), var(--color-accent-deep))',
                  marginTop: '1.5rem',
                }}
              />
            </GlassCard>
          ))}
        </div>
      </div>
    </section>
  );
}
