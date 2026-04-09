import type { Metadata } from 'next';
import { spaceGrotesk, inter } from '@/lib/fonts';
import SmoothScroll from '@/components/layout/SmoothScroll';
import Navigation from '@/components/layout/Navigation';
import Preloader from '@/components/layout/Preloader';
import CustomCursor from '@/components/layout/CustomCursor';
import './globals.css';

export const metadata: Metadata = {
  title: 'Nomad Soluções em Web',
  description: 'Agência de design e desenvolvimento web. Liberdade criativa, resultados reais.',
  keywords: 'web design, desenvolvimento web, branding, UX/UI, agência digital',
  openGraph: {
    title: 'Nomad Soluções em Web',
    description: 'Criamos experiências digitais que encantam e convertem.',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR" className={`${spaceGrotesk.variable} ${inter.variable}`}>
      <body>
        <SmoothScroll>
          <Preloader />
          <CustomCursor />
          <Navigation />
          {children}
        </SmoothScroll>
      </body>
    </html>
  );
}
