import './globals.css'
import { Inter, Space_Grotesk } from 'next/font/google'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })
const space = Space_Grotesk({ subsets: ['latin'], variable: '--font-space' })

export const metadata = {
  title: 'KhetAlert — Vidarbha Multi-Hazard Early Warning',
  description: 'Open-source multi-hazard early warning & rescue decision-support for Vidarbha, Maharashtra',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} ${space.variable} font-sans antialiased`}>
        {children}
      </body>
    </html>
  )
}
