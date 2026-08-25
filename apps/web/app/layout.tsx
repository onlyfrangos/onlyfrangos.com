import type { Metadata } from 'next';
import { Bebas_Neue, Manrope } from 'next/font/google';

import './globals.css';

const heading = Bebas_Neue({
  subsets: ['latin'],
  variable: '--font-heading',
  weight: '400',
});

const body = Manrope({
  subsets: ['latin'],
  variable: '--font-body',
});

export const metadata: Metadata = {
  title: 'OnlyFrangos',
  description: 'Fitness social network',
  icons: {
    icon: '/branding/onlyfrangos-logo.png',
    shortcut: '/branding/onlyfrangos-logo.png',
    apple: '/branding/onlyfrangos-logo.png',
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR" className={`${heading.variable} ${body.variable}`}>
      <body className="font-[var(--font-body)]">{children}</body>
    </html>
  );
}
