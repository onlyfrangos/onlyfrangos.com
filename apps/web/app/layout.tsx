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

const siteUrl = new URL(process.env.NEXT_PUBLIC_SITE_URL ?? 'https://onlyfrangos.com');
const siteDescription =
  'Rede social fitness brasileira para compartilhar treinos, evolução e conquistas.';

export const metadata: Metadata = {
  metadataBase: siteUrl,
  applicationName: 'OnlyFrangos',
  title: {
    default: 'OnlyFrangos',
    template: '%s | OnlyFrangos',
  },
  description: siteDescription,
  openGraph: {
    type: 'website',
    locale: 'pt_BR',
    url: '/',
    siteName: 'OnlyFrangos',
    title: 'OnlyFrangos',
    description: siteDescription,
    images: ['/branding/onlyfrangos-logo.png'],
  },
  twitter: {
    card: 'summary',
    title: 'OnlyFrangos',
    description: siteDescription,
    images: ['/branding/onlyfrangos-logo.png'],
  },
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
