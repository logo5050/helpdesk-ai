import type { Metadata } from 'next';
import { JetBrains_Mono, Inter } from 'next/font/google';
import { NavBar } from '@/components/NavBar';
import './globals.css';

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap',
});

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'ShieldDesk | Security Assessment',
  description: 'AI-powered security risk assessment for help desk technicians',
  keywords: ['security', 'helpdesk', 'IT support', 'risk assessment', 'social engineering'],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${jetbrainsMono.variable} ${inter.variable} antialiased min-h-screen`}
        style={{
          background: '#0A0B10',
          color: '#F0F2F5',
          fontFamily: 'var(--font-sans)',
        }}
      >
        <div className="flex flex-col min-h-screen">
          <NavBar />
          <main className="flex-1">{children}</main>
        </div>
      </body>
    </html>
  );
}
