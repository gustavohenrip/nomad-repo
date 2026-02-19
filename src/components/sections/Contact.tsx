'use client';

import { useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import GlassCard from '@/components/ui/GlassCard';
import MagneticButton from '@/components/ui/MagneticButton';
import RevealOnScroll from '@/components/ui/RevealOnScroll';

gsap.registerPlugin(ScrollTrigger, useGSAP);

const HEADING_WORDS = ['Vamos', 'criar', 'algo', 'incrível', 'juntos.'];

const INPUT_STYLE: React.CSSProperties = {
  width: '100%',
  background: 'transparent',
  border: 'none',
  borderBottom: '1px solid rgba(0,0,0,0.15)',
  outline: 'none',
  fontFamily: 'var(--font-body)',
  fontSize: '0.95rem',
  color: 'var(--color-text-primary)',
  padding: '0.65rem 0',
  transition: 'border-color 0.25s',
  boxSizing: 'border-box',
};

const LABEL_STYLE: React.CSSProperties = {
  display: 'block',
  fontFamily: 'var(--font-body)',
  fontSize: '0.65rem',
  letterSpacing: '0.2em',
  textTransform: 'uppercase',
  color: 'var(--color-accent)',
  fontWeight: 500,
  marginBottom: '0.35rem',
};

export default function Contact() {
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);

  const [form, setForm] = useState({
    nome: '',
    sobrenome: '',
    email: '',
    telefone: '',
    empresa: '',
    objetivo: '',
  });

  const [focusedField, setFocusedField] = useState<string | null>(null);

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const subject = `Novo contato — ${form.nome} ${form.sobrenome}`;
    const body = `Nome: ${form.nome} ${form.sobrenome}
E-mail: ${form.email}
Telefone: ${form.telefone}
Empresa: ${form.empresa}

Objetivo / Mensagem:
${form.objetivo}`;
    window.open(`mailto:nomad.solucoes.web@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`);
  }

  useGSAP(() => {
    if (!headingRef.current) return;
    const words = headingRef.current.querySelectorAll('.contact-word');
    gsap.from(words, {
      y: 55,
      opacity: 0,
      stagger: 0.09,
      duration: 0.9,
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
      id="contato"
      className="grain-section"
      style={{
        background: 'linear-gradient(160deg, var(--color-bg-primary) 0%, var(--color-accent-light) 60%, var(--color-bg-secondary) 100%)',
        padding: 'clamp(5rem, 12vw, 11rem) 0',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <div
        className="orb"
        style={{
          width: '700px',
          height: '700px',
          background: 'radial-gradient(circle, rgba(91, 141, 191, 0.12) 0%, transparent 70%)',
          top: '-200px',
          left: '-150px',
          animationDuration: '26s',
        }}
      />
      <div
        className="orb"
        style={{
          width: '400px',
          height: '400px',
          background: 'radial-gradient(circle, rgba(74, 124, 158, 0.08) 0%, transparent 70%)',
          bottom: '-100px',
          right: '10%',
          animationDuration: '18s',
          animationDelay: '10s',
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
            gap: 'clamp(3rem, 5vw, 5rem)',
            alignItems: 'center',
          }}
        >
          <div style={{ gridColumn: 'span 6' }}>
            <span
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
              Contato
            </span>
            <h2
              ref={headingRef}
              aria-label="Vamos criar algo incrível juntos."
              style={{
                fontFamily: 'var(--font-heading)',
                fontSize: 'clamp(2.2rem, 4.5vw, 4.2rem)',
                fontWeight: 700,
                color: 'var(--color-text-primary)',
                letterSpacing: '-0.02em',
                lineHeight: 1.08,
                marginBottom: '2rem',
              }}
            >
              {HEADING_WORDS.map((word, i) => (
                <span
                  key={i}
                  className="contact-word"
                  aria-hidden="true"
                  style={{ display: 'block' }}
                >
                  {word}
                </span>
              ))}
            </h2>
            <p
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: 'clamp(0.95rem, 1.2vw, 1.1rem)',
                color: 'var(--color-text-secondary)',
                lineHeight: 1.75,
                marginBottom: '2.5rem',
              }}
            >
              Entre em contato e dê o primeiro passo para transformar sua presença digital.
            </p>
          </div>

          <div style={{ gridColumn: 'span 6' }}>
            <RevealOnScroll delay={0.2} x={60} y={0}>
              <GlassCard
                variant="default"
                hover={false}
                style={{
                  padding: 'clamp(2rem, 4vw, 3.5rem)',
                }}
              >
                <form onSubmit={handleSubmit} noValidate>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                      <div>
                        <label htmlFor="nome" style={LABEL_STYLE}>Nome</label>
                        <input
                          id="nome"
                          name="nome"
                          type="text"
                          required
                          value={form.nome}
                          onChange={handleChange}
                          onFocus={() => setFocusedField('nome')}
                          onBlur={() => setFocusedField(null)}
                          placeholder="João"
                          style={{
                            ...INPUT_STYLE,
                            borderBottomColor: focusedField === 'nome' ? 'var(--color-accent)' : 'rgba(0,0,0,0.15)',
                          }}
                        />
                      </div>
                      <div>
                        <label htmlFor="sobrenome" style={LABEL_STYLE}>Sobrenome</label>
                        <input
                          id="sobrenome"
                          name="sobrenome"
                          type="text"
                          required
                          value={form.sobrenome}
                          onChange={handleChange}
                          onFocus={() => setFocusedField('sobrenome')}
                          onBlur={() => setFocusedField(null)}
                          placeholder="Silva"
                          style={{
                            ...INPUT_STYLE,
                            borderBottomColor: focusedField === 'sobrenome' ? 'var(--color-accent)' : 'rgba(0,0,0,0.15)',
                          }}
                        />
                      </div>
                    </div>

                    <div>
                      <label htmlFor="email" style={LABEL_STYLE}>E-mail</label>
                      <input
                        id="email"
                        name="email"
                        type="email"
                        required
                        value={form.email}
                        onChange={handleChange}
                        onFocus={() => setFocusedField('email')}
                        onBlur={() => setFocusedField(null)}
                        placeholder="joao@empresa.com"
                        style={{
                          ...INPUT_STYLE,
                          borderBottomColor: focusedField === 'email' ? 'var(--color-accent)' : 'rgba(0,0,0,0.15)',
                        }}
                      />
                    </div>

                    <div>
                      <label htmlFor="telefone" style={LABEL_STYLE}>Telefone / WhatsApp</label>
                      <input
                        id="telefone"
                        name="telefone"
                        type="tel"
                        required
                        value={form.telefone}
                        onChange={handleChange}
                        onFocus={() => setFocusedField('telefone')}
                        onBlur={() => setFocusedField(null)}
                        placeholder="+55 11 99999-9999"
                        style={{
                          ...INPUT_STYLE,
                          borderBottomColor: focusedField === 'telefone' ? 'var(--color-accent)' : 'rgba(0,0,0,0.15)',
                        }}
                      />
                    </div>

                    <div>
                      <label htmlFor="empresa" style={LABEL_STYLE}>Empresa</label>
                      <input
                        id="empresa"
                        name="empresa"
                        type="text"
                        required
                        value={form.empresa}
                        onChange={handleChange}
                        onFocus={() => setFocusedField('empresa')}
                        onBlur={() => setFocusedField(null)}
                        placeholder="Minha Empresa Ltda"
                        style={{
                          ...INPUT_STYLE,
                          borderBottomColor: focusedField === 'empresa' ? 'var(--color-accent)' : 'rgba(0,0,0,0.15)',
                        }}
                      />
                    </div>

                    <div>
                      <label htmlFor="objetivo" style={LABEL_STYLE}>Objetivo do Projeto</label>
                      <textarea
                        id="objetivo"
                        name="objetivo"
                        required
                        rows={3}
                        value={form.objetivo}
                        onChange={handleChange}
                        onFocus={() => setFocusedField('objetivo')}
                        onBlur={() => setFocusedField(null)}
                        placeholder="Descreva brevemente o que você precisa..."
                        style={{
                          ...INPUT_STYLE,
                          resize: 'none',
                          borderBottomColor: focusedField === 'objetivo' ? 'var(--color-accent)' : 'rgba(0,0,0,0.15)',
                        }}
                      />
                    </div>

                    <MagneticButton
                      type="submit"
                      style={{
                        fontFamily: 'var(--font-body)',
                        fontSize: '0.85rem',
                        fontWeight: 600,
                        letterSpacing: '0.08em',
                        color: '#FFFFFF',
                        background: 'var(--color-accent)',
                        border: 'none',
                        borderRadius: '9999px',
                        padding: '1rem 2.5rem',
                        cursor: 'pointer',
                        textTransform: 'uppercase',
                        alignSelf: 'flex-start',
                      }}
                    >
                      Enviar mensagem
                    </MagneticButton>
                  </div>
                </form>
              </GlassCard>
            </RevealOnScroll>
          </div>
        </div>
      </div>
    </section>
  );
}
