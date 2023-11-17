import '@radix-ui/themes/styles.css';
import "./theme-config.css"
import './globals.css'
import { Inter } from 'next/font/google'
import NavBar from "./navBar";
import { Theme, ThemePanel } from '@radix-ui/themes';


const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter'
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={inter.variable}>
      <body className='p-5'>
      <Theme appearance="light" accentColor="iris" radius="full" scaling="105%">
        <NavBar/>
        {children}
        </Theme>
        </body>

    </html>
  )
}
