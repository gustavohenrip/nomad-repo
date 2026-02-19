'use client';

import { scrollTo } from '@/lib/scrollTo';

const FOOTER_LINKS = [
  { label: 'Serviços', href: '#servicos' },
  { label: 'Portfólio', href: '#portfolio' },
  { label: 'Processo', href: '#processo' },
  { label: 'Contato', href: '#contato' },
];

export default function Footer() {
  return (
    <footer
      style={{
        background: 'var(--color-bg-secondary)',
        borderTop: '1px solid rgba(0,0,0,0.06)',
        padding: 'clamp(2.5rem, 5vw, 4rem) 0',
      }}
    >
      <div
        style={{
          maxWidth: '80rem',
          margin: '0 auto',
          padding: '0 1.5rem',
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '2.5rem',
          }}
        >
          <div
            style={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '2rem',
            }}
          >
            <button
              onClick={() => scrollTo('#hero')}
              style={{
                fontFamily: 'var(--font-heading)',
                fontWeight: 700,
                fontSize: '1.25rem',
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

            <nav
              style={{
                display: 'flex',
                gap: '2rem',
                flexWrap: 'wrap',
              }}
            >
              {FOOTER_LINKS.map((link) => (
                <button
                  key={link.href}
                  onClick={() => scrollTo(link.href)}
                  style={{
                    fontFamily: 'var(--font-body)',
                    fontSize: '0.875rem',
                    color: 'var(--color-text-muted)',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    transition: 'color 0.25s',
                    padding: 0,
                    fontWeight: 400,
                  }}
                  onMouseEnter={(e) => {
                    (e.target as HTMLButtonElement).style.color = 'var(--color-text-primary)';
                  }}
                  onMouseLeave={(e) => {
                    (e.target as HTMLButtonElement).style.color = 'var(--color-text-muted)';
                  }}
                >
                  {link.label}
                </button>
              ))}
            </nav>
          </div>

          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '2rem',
              paddingTop: '1.5rem',
              paddingBottom: '1.5rem',
              borderTop: '1px solid rgba(0,0,0,0.06)',
            }}
          >
            {[
              { label: 'E-mail', value: 'nomad.solucoes.web@gmail.com', href: 'mailto:nomad.solucoes.web@gmail.com' },
            ].map((item) => (
              <div key={item.label}>
                <span
                  style={{
                    display: 'block',
                    fontFamily: 'var(--font-body)',
                    fontSize: '0.65rem',
                    letterSpacing: '0.2em',
                    textTransform: 'uppercase',
                    color: 'var(--color-accent)',
                    fontWeight: 500,
                    marginBottom: '0.3rem',
                  }}
                >
                  {item.label}
                </span>
                <a
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    fontFamily: 'var(--font-body)',
                    fontSize: '0.85rem',
                    color: 'var(--color-text-muted)',
                    fontWeight: 400,
                    textDecoration: 'none',
                    transition: 'color 0.25s',
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLAnchorElement).style.color = 'var(--color-text-primary)';
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLAnchorElement).style.color = 'var(--color-text-muted)';
                  }}
                >
                  {item.value}
                </a>
              </div>
            ))}
          </div>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '1rem',
              paddingTop: '1.5rem',
              borderTop: '1px solid rgba(0,0,0,0.06)',
            }}
          >
            <p
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: '0.8rem',
                color: 'var(--color-text-muted)',
                fontWeight: 400,
              }}
            >
              © 2026 Nomad Soluções em Web. Todos os direitos reservados.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
