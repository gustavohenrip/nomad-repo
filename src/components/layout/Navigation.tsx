'use client';

import { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';
import { NAV_LINKS } from '@/lib/constants';
import MagneticButton from '@/components/ui/MagneticButton';
import { scrollTo } from '@/lib/scrollTo';
import { useMediaQuery } from '@/hooks/useMediaQuery';

gsap.registerPlugin(useGSAP);

export default function Navigation() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const navRef = useRef<HTMLElement>(null);
  const turbulenceRef = useRef<SVGFETurbulenceElement>(null);
  const isDesktop = useMediaQuery('(min-width: 768px)');

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 80);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (window.matchMedia('(hover: none)').matches) return;
    let t = 0;
    const tick = () => {
      if (!turbulenceRef.current) return;
      t += 0.0022;
      const bfX = (0.016 + Math.sin(t) * 0.008).toFixed(4);
      const bfY = (0.048 + Math.cos(t * 0.6) * 0.014).toFixed(4);
      turbulenceRef.current.setAttribute('baseFrequency', `${bfX} ${bfY}`);
    };
    gsap.ticker.add(tick);
    return () => gsap.ticker.remove(tick);
  }, []);

  useGSAP(() => {
    gsap.from(navRef.current, {
      y: -80,
      opacity: 0,
      duration: 0.8,
      ease: 'power2.out',
      delay: 2.8,
    });
  }, { scope: navRef });

  const handleLink = (href: string) => {
    setMenuOpen(false);
    scrollTo(href);
  };

  return (
    <>
      <svg
        aria-hidden="true"
        style={{ position: 'absolute', width: 0, height: 0, overflow: 'hidden' }}
      >
        <defs>
          <filter id="liquid-glass-distort" x="-5%" y="-5%" width="110%" height="110%" colorInterpolationFilters="sRGB">
            <feTurbulence
              ref={turbulenceRef}
              type="fractalNoise"
              baseFrequency="0.018 0.052"
              numOctaves="3"
              seed="12"
              result="noise"
            />
            <feColorMatrix type="saturate" values="0" in="noise" result="grayNoise" />
            <feDisplacementMap
              in="SourceGraphic"
              in2="grayNoise"
              scale="22"
              xChannelSelector="R"
              yChannelSelector="G"
            />
          </filter>
        </defs>
      </svg>

      <nav
        ref={navRef}
        className={scrolled ? 'nav-glass-scrolled' : ''}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 50,
          overflow: 'hidden',
          background: scrolled ? undefined : 'transparent',
          borderBottom: scrolled ? undefined : 'none',
          boxShadow: scrolled ? undefined : 'none',
          transition: 'background 0.5s ease, box-shadow 0.5s ease, backdrop-filter 0.5s ease, -webkit-backdrop-filter 0.5s ease, border-color 0.5s ease',
          backdropFilter: scrolled
            ? 'blur(20px) saturate(1.8) brightness(1.05)'
            : 'none',
          WebkitBackdropFilter: scrolled
            ? 'blur(20px) saturate(1.8) brightness(1.05)'
            : 'none',
        }}
      >
        <div
          className="nav-liquid-layer"
          style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(165deg, rgba(255,255,255,0.72) 0%, rgba(248,246,243,0.22) 30%, rgba(184,212,238,0.28) 60%, rgba(255,255,255,0.65) 100%)',
            filter: 'url(#liquid-glass-distort)',
            pointerEvents: 'none',
            zIndex: 0,
            opacity: scrolled ? 1 : 0,
            transition: 'opacity 0.5s ease',
          }}
        />
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '1px',
            background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.9) 20%, rgba(255,255,255,1) 50%, rgba(255,255,255,0.9) 80%, transparent 100%)',
            pointerEvents: 'none',
            zIndex: 1,
            opacity: scrolled ? 1 : 0,
            transition: 'opacity 0.5s ease',
          }}
        />
        <div
          style={{
            position: 'relative',
            zIndex: 2,
            maxWidth: '80rem',
            margin: '0 auto',
            padding: '1.1rem 1.5rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <button
            onClick={() => scrollTo('#hero')}
            style={{
              fontFamily: 'var(--font-heading)',
              fontWeight: 700,
              fontSize: '1.1rem',
              letterSpacing: '0.12em',
              color: 'var(--color-text-primary)',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: 0,
            }}
          >
            NOMAD
          </button>

          {isDesktop && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
              {NAV_LINKS.map((link) => (
                <button
                  key={link.href}
                  onClick={() => handleLink(link.href)}
                  style={{
                    fontFamily: 'var(--font-body)',
                    fontSize: '0.875rem',
                    fontWeight: 500,
                    color: 'var(--color-text-secondary)',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    transition: 'color 0.25s',
                    padding: '0.25rem 0',
                    position: 'relative',
                  }}
                  onMouseEnter={(e) => {
                    (e.target as HTMLButtonElement).style.color = 'var(--color-text-primary)';
                  }}
                  onMouseLeave={(e) => {
                    (e.target as HTMLButtonElement).style.color = 'var(--color-text-secondary)';
                  }}
                >
                  {link.label}
                </button>
              ))}
            </div>
          )}

          {isDesktop && (
            <MagneticButton
              onClick={() => handleLink('#contato')}
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: '0.875rem',
                fontWeight: 500,
                color: 'var(--color-accent)',
                background: 'transparent',
                border: '1px solid var(--color-accent)',
                borderRadius: '9999px',
                padding: '0.6rem 1.5rem',
                cursor: 'pointer',
                transition: 'background 0.3s, color 0.3s',
              }}
            >
              Fale Conosco
            </MagneticButton>
          )}

          {!isDesktop && (
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Menu"
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                gap: '5px',
                padding: '0.5rem',
              }}
            >
            <span
              style={{
                display: 'block',
                width: '22px',
                height: '1.5px',
                background: 'var(--color-text-primary)',
                transition: 'transform 0.3s',
                transform: menuOpen ? 'rotate(45deg) translate(4.5px, 4.5px)' : 'none',
              }}
            />
            <span
              style={{
                display: 'block',
                width: '22px',
                height: '1.5px',
                background: 'var(--color-text-primary)',
                transition: 'opacity 0.3s',
                opacity: menuOpen ? 0 : 1,
              }}
            />
            <span
              style={{
                display: 'block',
                width: '22px',
                height: '1.5px',
                background: 'var(--color-text-primary)',
                transition: 'transform 0.3s',
                transform: menuOpen ? 'rotate(-45deg) translate(4.5px, -4.5px)' : 'none',
              }}
            />
          </button>
          )}
        </div>
      </nav>

      {menuOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 40,
            background: 'rgba(248, 246, 243, 0.96)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '2.5rem',
          }}
        >
          {NAV_LINKS.map((link) => (
            <button
              key={link.href}
              onClick={() => handleLink(link.href)}
              style={{
                fontFamily: 'var(--font-heading)',
                fontSize: 'clamp(1.8rem, 6vw, 3rem)',
                fontWeight: 600,
                color: 'var(--color-text-primary)',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                letterSpacing: '-0.02em',
              }}
            >
              {link.label}
            </button>
          ))}
        </div>
      )}
    </>
  );
}
