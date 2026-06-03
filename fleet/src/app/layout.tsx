import type { Metadata } from 'next'
import './globals.css'
import { Providers } from '../components/Providers'

export const metadata: Metadata = {
  title: 'Tonly EV Fleet Management',
  description: 'Complete fleet management system for Tonly EV trucks',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
