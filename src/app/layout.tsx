import type { Metadata } from 'next';
import { JetBrains_Mono, IBM_Plex_Sans } from 'next/font/google';
import { NavBar } from '@/components/NavBar';
import './globals.css';

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains-mono',
  display: 'swap',
});

const ibmPlexSans = IBM_Plex_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-ibm-plex-sans',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'HelpDesk AI Companion',
  description: 'AI-powered IT troubleshooting assistant for help desk technicians',
  keywords: ['helpdesk', 'IT support', 'troubleshooting', 'AI assistant'],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${jetbrainsMono.variable} ${ibmPlexSans.variable} antialiased bg-slate-950 text-slate-100 min-h-screen`}
      >
        <div className="flex flex-col min-h-screen">
          <NavBar />
          <main className="flex-1">{children}</main>
        </div>
      </body>
    </html>
  );
}
