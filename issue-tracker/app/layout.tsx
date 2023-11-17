import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import NavBar from "./navBar";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" data-theme="cyberpunk">
      
      <body>
      <NavBar/>
        {children}
        </body>
    </html>
  )
}
