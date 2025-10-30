import type {Metadata} from 'next';
import {Toaster} from '@/components/ui/toaster';
import './globals.css';

export const metadata: Metadata = {
  title: 'LingoFlow AI | AI-Powered German Conversation Coach',
  description: 'Practice real-life German conversations with an AI tutor that provides contextual corrections and instant translations.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=PT+Sans:wght@400;700&family=Source+Code+Pro:wght@400;600&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased">
        {children}
        <Toaster />
      </body>
    </html>
  );
}
