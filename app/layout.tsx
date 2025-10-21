export const metadata = {
  title: 'Litium Admin MCP Server',
  description: 'Model Context Protocol server for Litium Admin Web API',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}

