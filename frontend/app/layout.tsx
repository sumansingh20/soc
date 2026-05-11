import React from 'react';
import '../styles/globals.css';
import { Navigation } from '@/components/Navigation';
import { SocSidebar } from '@/components/SocSidebar';
import { Footer } from '@/components/Footer';

export const metadata = {
  title: 'HackShield SOC Training',
  description: 'Practical SOC analyst learning portal created by Suman Kumar.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-soc-dark text-white">
        <Navigation />
        <SocSidebar />
        <main className="min-h-screen pt-20 pb-20 xl:pl-72">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
