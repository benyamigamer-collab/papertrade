import './globals.css'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'B.K Mine', description: 'B.K Mine — باشگاه مشتریان' }

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <html lang="fa" dir="rtl"><body>{children}</body></html>
}