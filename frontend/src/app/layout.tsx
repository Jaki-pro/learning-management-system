import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';  
import { ThemeProvider } from '../../context/ThemeContext'; 

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Aura LMS | Modern Learning Platform',
  description: 'A full-stack LMS with Next.js and Strapi',
}; 
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} antialiased`}>
        <ThemeProvider> 
          <div className="min-h-screen bg-background text-foreground">
            {children}
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}