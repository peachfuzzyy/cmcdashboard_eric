export const metadata = {
  title: 'CMC Markets — AM Dashboard',
  description: 'Account Manager Dashboard — Live market data with AI commentary',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/@tabler/icons-webfont@latest/tabler-icons.min.css"
        />
      </head>
      <body style={{ margin: 0, padding: 0, background: '#F4F6F9', fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" }}>
        {children}
      </body>
    </html>
  )
}
