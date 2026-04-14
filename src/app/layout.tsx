import type { Metadata } from 'next'
import { Athiti } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'

const athiti = Athiti({ 
  subsets: ["thai", "latin"],
  weight: ["200", "300", "400", "500", "600", "700"],
  variable: "--font-athiti"
});

export const metadata: Metadata = {
  title: 'นาฬิกาชีวิต - Death Expectancy Calculator',
  description: 'Calculate your remaining days based on your lifestyle choices',
  generator: 'v0.app',
  icons: {
    icon: [
      {
        url: '/icon-light-32x32.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/icon-dark-32x32.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/apple-icon.png',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="th" className="dark">
      <body className={`${athiti.variable} font-sans antialiased`}>
        {children}
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
