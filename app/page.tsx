export default function Home() {
  return (
    <main style={{ padding: '2rem', fontFamily: 'system-ui', maxWidth: '800px', margin: '0 auto' }}>
      <h1>Litium Admin MCP Server</h1>
      <p>HTTP-based Model Context Protocol server for Litium Admin Web API</p>
      
      <div style={{ background: '#f0f9ff', padding: '1rem', borderRadius: '8px', marginBottom: '2rem', borderLeft: '4px solid #0284c7' }}>
        <p style={{ margin: 0 }}>
          📚 <strong>Documentation:</strong>{' '}
          <a href="https://litium.mintlify.app/" target="_blank" rel="noopener noreferrer" style={{ color: '#0284c7' }}>
            https://litium.mintlify.app/
          </a>
        </p>
      </div>
      
      <h2>Status</h2>
      <p>✅ Server is running</p>
      
      <h2>Quick Links</h2>
      <ul>
        <li><a href="https://litium.mintlify.app/get-started/quickstart" target="_blank" rel="noopener noreferrer">Quick Start Guide</a></li>
        <li><a href="https://litium.mintlify.app/get-started/configuration" target="_blank" rel="noopener noreferrer">Configuration Instructions</a></li>
        <li><a href="https://litium.mintlify.app/tools/overview" target="_blank" rel="noopener noreferrer">Tools Reference (18 tools)</a></li>
        <li><a href="https://github.com/tonnguyen/litium-admin-mcp-server" target="_blank" rel="noopener noreferrer">GitHub Repository</a></li>
      </ul>
      
      <h2>MCP Endpoint</h2>
      <ul>
        <li><code>/api/mcp</code> - MCP endpoint (POST)</li>
      </ul>

      <h2>Configuration Example</h2>
      <p>Configure your MCP client (Cursor, Claude Desktop, etc.) with:</p>
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

