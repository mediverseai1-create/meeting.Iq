import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: { default: 'MeetingIQ', template: '%s · MeetingIQ' },
  description: 'AI-powered meeting intelligence. Capture, transcribe, and act on every meeting.',
  icons: { icon: '/favicon.ico' },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
