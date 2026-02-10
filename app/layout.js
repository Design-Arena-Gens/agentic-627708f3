export const metadata = {
  title: 'Mobile Arena Targeting Test',
  description: 'Test mobile touch interactions and arena targeting',
  viewport: 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body style={{ margin: 0, padding: 0, touchAction: 'none' }}>{children}</body>
    </html>
  )
}
