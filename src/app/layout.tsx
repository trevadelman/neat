import React from 'react';
import { Inter } from 'next/font/google';
import MainLayout from '@/components/layout/MainLayout';
import StyledComponentsRegistry from '@/lib/utils/StyledComponentsRegistry';
import '@/styles/globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Neat - Your Personal Cocktail Discovery App',
  description: 'Discover, create, and manage your favorite cocktails with Neat',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <StyledComponentsRegistry>
          <MainLayout>{children}</MainLayout>
        </StyledComponentsRegistry>
      </body>
    </html>
  );
}
