import './globals.css'
import { Inter, Space_Grotesk } from 'next/font/google'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })
const space = Space_Grotesk({ subsets: ['latin'], variable: '--font-space' })

export const metadata = {
  title: 'ResqAI-Map — Emergency Response & Disaster Mitigation',
  description: 'Turns raw weather predictions into actionable preparation tasks for the public and tactical routing for rescue operations.',
  manifest: '/manifest.json',
}

export const viewport = { themeColor: '#0b1220', width: 'device-width', initialScale: 1 }

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} ${space.variable} font-sans antialiased`}>
        {children}
      </body>
    </html>
  )
}
