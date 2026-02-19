import { Space_Grotesk, Inter } from 'next/font/google';

export const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-heading',
  weight: ['300', '400', '500', '600', '700'],
});

export const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-body',
});
