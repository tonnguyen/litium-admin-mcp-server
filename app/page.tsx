export default function Home() {
  return (
    <main style={{ padding: '2rem', fontFamily: 'system-ui' }}>
      <h1>Litium Admin MCP Server</h1>
      <p>Model Context Protocol server for Litium Admin Web API</p>
      
      <h2>Status</h2>
      <p>✅ Server is running</p>
      
      <h2>Endpoints</h2>
      <ul>
        <li><code>/api/mcp</code> - MCP endpoint (POST)</li>
      </ul>

      <h2>Usage</h2>
      <p>Configure your MCP client with:</p>
      <pre style={{ background: '#f5f5f5', padding: '1rem', borderRadius: '4px' }}>
{`{
  "mcpServers": {
    "litium-admin": {
      "url": "https://your-deployment.vercel.app/api/mcp",
      "headers": {
        "X-Litium-Base-Url": "\${input:litium_base_url}",
        "X-Litium-Client-Id": "\${input:litium_client_id}",
        "X-Litium-Client-Secret": "\${input:litium_client_secret}"
      }
    }
  }
}`}
      </pre>
    </main>
  )
}

