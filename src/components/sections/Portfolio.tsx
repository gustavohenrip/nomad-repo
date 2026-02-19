'use client';

import { useRef, useState, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { useMediaQuery } from '@/hooks/useMediaQuery';

gsap.registerPlugin(ScrollTrigger, useGSAP);

interface Project {
  id: number;
  name: string;
  url: string;
  stack: string;
  year: string;
}

const PROJECTS: Project[] = [
  {
    id: 1,
    name: 'RSAT Rastreamentos',
    url: 'https://nomadsolucoes.me/rsat/',
    stack: 'React / TypeScript / Tailwind / Vite',
    year: '2026',
  },
];

function ProjectModal({ project, onClose }: { project: Project; onClose: () => void }) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);
  const [iframeLoaded, setIframeLoaded] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

  useEffect(() => {
    const overlay = overlayRef.current;
    const modal = modalRef.current;
    if (!overlay || !modal) return;

    gsap.fromTo(overlay,
      { opacity: 0 },
      { opacity: 1, duration: 0.45, ease: 'power2.out' }
    );
    gsap.fromTo(modal,
      { opacity: 0, scale: 0.86, y: 48 },
      { opacity: 1, scale: 1, y: 0, duration: 0.65, ease: 'power4.out', delay: 0.05 }
    );
  }, []);

  function handleClose() {
    if (isClosing) return;
    setIsClosing(true);
    const overlay = overlayRef.current;
    const modal = modalRef.current;
    if (!overlay || !modal) { onClose(); return; }

    gsap.to(modal, { opacity: 0, scale: 0.9, y: 32, duration: 0.35, ease: 'power3.in' });
    gsap.to(overlay, { opacity: 0, duration: 0.4, ease: 'power2.in', onComplete: onClose });
  }

  return (
    <div
      ref={overlayRef}
      onClick={handleClose}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 200,
        background: 'rgba(10, 10, 10, 0.72)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem',
      }}
    >
      <div
        ref={modalRef}
        onClick={(e) => e.stopPropagation()}
        style={{
          width: '100%',
          maxWidth: '1200px',
          height: '85vh',
          background: 'rgba(248, 246, 243, 0.97)',
          backdropFilter: 'blur(24px)',
          WebkitBackdropFilter: 'blur(24px)',
          borderRadius: '1.5rem',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          border: '1px solid rgba(255,255,255,0.7)',
          boxShadow: '0 40px 100px rgba(0,0,0,0.3)',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '1rem 1.5rem',
            borderBottom: '1px solid rgba(0,0,0,0.06)',
            flexShrink: 0,
            background: 'rgba(255,255,255,0.5)',
          }}
        >
          <span
            style={{
              fontFamily: 'var(--font-heading)',
              fontWeight: 600,
              fontSize: '0.95rem',
              color: 'var(--color-text-primary)',
              letterSpacing: '-0.01em',
            }}
          >
            {project.name}
          </span>
          <button
            onClick={handleClose}
            style={{
              background: 'rgba(0,0,0,0.07)',
              border: 'none',
              borderRadius: '50%',
              width: '32px',
              height: '32px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.2rem',
              lineHeight: 1,
              color: 'var(--color-text-secondary)',
              transition: 'background 0.2s',
            }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.background = 'rgba(0,0,0,0.14)'; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = 'rgba(0,0,0,0.07)'; }}
          >
            x
          </button>
        </div>

        <div style={{ flex: 1, position: 'relative' }}>
          {!iframeLoaded && (
            <div
              style={{
                position: 'absolute',
                inset: 0,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '1.25rem',
                background: 'linear-gradient(135deg, #E8F1F8 0%, #C8DDEF 100%)',
                zIndex: 1,
              }}
            >
              <div
                style={{
                  width: '36px',
                  height: '36px',
                  border: '2.5px solid rgba(91,141,191,0.25)',
                  borderTopColor: 'var(--color-accent)',
                  borderRadius: '50%',
                  animation: 'spin 0.75s linear infinite',
                }}
              />
              <span
                style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: '0.7rem',
                  letterSpacing: '0.22em',
                  textTransform: 'uppercase',
                  color: 'rgba(10,10,10,0.35)',
                  fontWeight: 500,
                }}
              >
                Carregando
              </span>
            </div>
          )}
          <iframe
            src={project.url}
            onLoad={() => setIframeLoaded(true)}
            style={{
              width: '100%',
              height: '100%',
              border: 'none',
              opacity: iframeLoaded ? 1 : 0,
              transition: 'opacity 0.4s ease',
            }}
            title={project.name}
          />
        </div>
      </div>
    </div>
  );
}

function WaveCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let t = 0;
    let lastTime = 0;
    const SPEED = 0.75;

    const blobs = [
      {
        cx: 0.28, cy: 0.38,
        ax: 0.30, ay: 0.26,
        fx: 0.41, fy: 0.67,
        px: 0, py: Math.PI / 3,
        r: [91, 141, 191], o: 0.55, sz: 0.72,
      },
      {
        cx: 0.70, cy: 0.44,
        ax: 0.26, ay: 0.30,
        fx: 0.29, fy: 0.38,
        px: Math.PI, py: 0,
        r: [118, 190, 248], o: 0.46, sz: 0.64,
      },
      {
        cx: 0.50, cy: 0.62,
        ax: 0.20, ay: 0.22,
        fx: 0.73, fy: 0.51,
        px: Math.PI / 2, py: Math.PI / 4,
        r: [172, 144, 230], o: 0.38, sz: 0.54,
      },
      {
        cx: 0.15, cy: 0.70,
        ax: 0.18, ay: 0.24,
        fx: 0.55, fy: 0.33,
        px: Math.PI * 1.5, py: Math.PI * 0.8,
        r: [140, 210, 235], o: 0.32, sz: 0.48,
      },
    ];

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      canvas.width = Math.max(1, Math.round(rect.width / 5));
      canvas.height = Math.max(1, Math.round(rect.height / 5));
    };

    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    function draw(timestamp: number) {
      if (!canvas || !ctx) return;

      const delta = lastTime ? Math.min((timestamp - lastTime) / 1000, 0.1) : 0.016;
      lastTime = timestamp;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      blobs.forEach(b => {
        const bx = (b.cx + b.ax * Math.sin(t * b.fx + b.px)) * canvas.width;
        const by = (b.cy + b.ay * Math.cos(t * b.fy + b.py)) * canvas.height;
        const radius = b.sz * Math.min(canvas.width, canvas.height) * 0.58;

        const g = ctx.createRadialGradient(bx, by, 0, bx, by, radius);
        g.addColorStop(0, `rgba(${b.r[0]},${b.r[1]},${b.r[2]},${b.o})`);
        g.addColorStop(0.45, `rgba(${b.r[0]},${b.r[1]},${b.r[2]},${b.o * 0.45})`);
        g.addColorStop(1, `rgba(${b.r[0]},${b.r[1]},${b.r[2]},0)`);

        ctx.fillStyle = g;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      });

      t += delta * SPEED;
      animId = requestAnimationFrame(draw);
    }

    animId = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(animId);
      ro.disconnect();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        filter: 'blur(6px)',
        pointerEvents: 'none',
      }}
    />
  );
}

function ArrowIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      style={{ transition: 'transform 0.4s cubic-bezier(0.23, 1, 0.32, 1)' }}
    >
      <path
        d="M5 15L15 5M15 5H8M15 5V12"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function Portfolio() {
  const sectionRef = useRef<HTMLElement>(null);
  const [activeProject, setActiveProject] = useState<Project | null>(null);
  const [hoveredId, setHoveredId] = useState<number | null>(null);
  const isDesktop = useMediaQuery('(min-width: 768px)');

  useGSAP(() => {
    if (!sectionRef.current) return;

    gsap.from('.portfolio-label', {
      opacity: 0,
      y: 30,
      duration: 0.8,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: '.portfolio-label',
        start: 'top 85%',
        toggleActions: 'play none none none',
      },
    });

    gsap.from('.portfolio-heading', {
      opacity: 0,
      y: 50,
      duration: 1,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: '.portfolio-heading',
        start: 'top 85%',
        toggleActions: 'play none none none',
      },
    });

    gsap.from('.portfolio-divider-top', {
      scaleX: 0,
      transformOrigin: 'left center',
      duration: 1.2,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: '.portfolio-divider-top',
        start: 'top 88%',
        toggleActions: 'play none none none',
      },
    });

    ScrollTrigger.batch('.portfolio-item', {
      onEnter: (batch) => {
        gsap.from(batch, {
          opacity: 0,
          y: 40,
          stagger: 0.15,
          duration: 0.9,
          ease: 'power3.out',
        });
      },
      start: 'top 90%',
    });
  }, { scope: sectionRef });

  return (
    <>
      <section
        ref={sectionRef}
        id="portfolio"
        style={{
          background: '#EEE9E2',
          padding: 'clamp(5rem, 12vw, 11rem) 0 clamp(3rem, 6vw, 5rem)',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '200px',
            background: 'linear-gradient(to bottom, var(--color-bg-primary) 0%, transparent 100%)',
            zIndex: 1,
            pointerEvents: 'none',
          }}
        />

        <div
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: '200px',
            background: 'linear-gradient(to top, var(--color-bg-primary) 0%, transparent 100%)',
            zIndex: 1,
            pointerEvents: 'none',
          }}
        />

        <div
          style={{
            position: 'absolute',
            inset: 0,
            overflow: 'hidden',
            zIndex: 0,
            pointerEvents: 'none',
          }}
        >
          <WaveCanvas />
          <div
            style={{
              position: 'absolute',
              inset: '-200%',
              width: '500%',
              height: '500%',
              backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
              animation: 'grain 0.35s steps(1) infinite',
              opacity: 0.055,
            }}
          />
        </div>

        <div style={{ maxWidth: '80rem', margin: '0 auto', padding: '0 1.5rem', position: 'relative', zIndex: 2 }}>
          <div style={{ marginBottom: 'clamp(3rem, 6vw, 5rem)' }}>
            <span
              className="portfolio-label"
              style={{
                display: 'block',
                fontFamily: 'var(--font-body)',
                fontSize: '0.7rem',
                letterSpacing: '0.25em',
                textTransform: 'uppercase',
                color: 'var(--color-accent)',
                marginBottom: '1.5rem',
                fontWeight: 500,
              }}
            >
              Trabalho Selecionado
            </span>
            <h2
              className="portfolio-heading"
              style={{
                fontFamily: 'var(--font-heading)',
                fontSize: 'clamp(2.5rem, 5.5vw, 5rem)',
                fontWeight: 700,
                color: '#0A0A0A',
                letterSpacing: '-0.03em',
                lineHeight: 1.05,
              }}
            >
              Projetos que nos{' '}
              <span
                style={{
                  color: 'var(--color-accent)',
                  fontStyle: 'italic',
                  fontWeight: 400,
                }}
              >
                orgulham
              </span>
            </h2>
          </div>

          <div
            className="portfolio-divider-top"
            style={{
              width: '100%',
              height: '1px',
              background: 'rgba(10, 10, 10, 0.1)',
            }}
          />

          {PROJECTS.map((project, i) => (
            <div key={project.id}>
              <div
                className="portfolio-item"
                onClick={() => setActiveProject(project)}
                onMouseEnter={() => setHoveredId(project.id)}
                onMouseLeave={() => setHoveredId(null)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  padding: 'clamp(2rem, 4vw, 3.5rem) 0',
                  cursor: 'pointer',
                  transition: 'opacity 0.4s ease',
                  opacity: hoveredId !== null && hoveredId !== project.id ? 0.4 : 1,
                }}
              >
                <span
                  style={{
                    fontFamily: 'var(--font-body)',
                    fontSize: 'clamp(0.75rem, 1vw, 0.9rem)',
                    color: 'var(--color-accent)',
                    fontWeight: 400,
                    minWidth: 'clamp(2.5rem, 4vw, 4rem)',
                    flexShrink: 0,
                  }}
                >
                  {String(i + 1).padStart(2, '0')}
                </span>

                <span
                  style={{
                    fontFamily: 'var(--font-heading)',
                    fontSize: 'clamp(1.8rem, 4vw, 3.5rem)',
                    fontWeight: 600,
                    color: '#0A0A0A',
                    letterSpacing: '-0.02em',
                    lineHeight: 1.1,
                    flex: 1,
                    transition: 'transform 0.5s cubic-bezier(0.23, 1, 0.32, 1)',
                    transform: hoveredId === project.id ? 'translateX(1rem)' : 'translateX(0)',
                  }}
                >
                  {project.name}
                </span>

                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 'clamp(1.5rem, 3vw, 3rem)',
                    flexShrink: 0,
                  }}
                >
                  {isDesktop && (
                    <span
                      style={{
                        fontFamily: 'var(--font-body)',
                        fontSize: 'clamp(0.65rem, 0.85vw, 0.8rem)',
                        color: 'rgba(10, 10, 10, 0.4)',
                        letterSpacing: '0.05em',
                      }}
                    >
                      {project.stack}
                    </span>
                  )}

                  {isDesktop && (
                    <span
                      style={{
                        fontFamily: 'var(--font-body)',
                        fontSize: 'clamp(0.65rem, 0.85vw, 0.8rem)',
                        color: 'rgba(10, 10, 10, 0.35)',
                        fontWeight: 400,
                      }}
                    >
                      {project.year}
                    </span>
                  )}

                  <div
                    style={{
                      width: 'clamp(40px, 4vw, 52px)',
                      height: 'clamp(40px, 4vw, 52px)',
                      borderRadius: '50%',
                      border: '1px solid rgba(10, 10, 10, 0.15)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'rgba(10, 10, 10, 0.45)',
                      transition: 'all 0.4s cubic-bezier(0.23, 1, 0.32, 1)',
                      background: hoveredId === project.id ? 'var(--color-accent)' : 'transparent',
                      borderColor: hoveredId === project.id ? 'var(--color-accent)' : 'rgba(10, 10, 10, 0.15)',
                    }}
                  >
                    <div
                      style={{
                        transition: 'transform 0.4s cubic-bezier(0.23, 1, 0.32, 1)',
                        transform: hoveredId === project.id ? 'rotate(0deg)' : 'rotate(0deg)',
                        color: hoveredId === project.id ? '#F8F6F3' : 'rgba(10, 10, 10, 0.45)',
                      }}
                    >
                      <ArrowIcon />
                    </div>
                  </div>
                </div>
              </div>

              <div
                style={{
                  width: '100%',
                  height: '1px',
                  background: 'rgba(10, 10, 10, 0.1)',
                }}
              />
            </div>
          ))}
        </div>
      </section>

      {activeProject && (
        <ProjectModal project={activeProject} onClose={() => setActiveProject(null)} />
      )}
    </>
  );
}
