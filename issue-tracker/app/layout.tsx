import '@radix-ui/themes/styles.css';
import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import NavBar from "./navBar";
import { Theme } from '@radix-ui/themes';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" data-theme="">
      <body>
        <Theme>
        <NavBar/>
        {children}
        </Theme>
        </body>

    </html>
  )
}
