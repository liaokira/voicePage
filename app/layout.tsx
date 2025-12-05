import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Cartesia Voice Mixer',
  description: 'Mix multiple voices and create a new voice using Cartesia API',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body style={{ margin: 0, fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif' }}>
        {children}
      </body>
    </html>
  )
}

