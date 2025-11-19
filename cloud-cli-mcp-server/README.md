# Litium Cloud CLI MCP Server

Local MCP server that wraps the installed `litium-cloud` CLI so developers can use natural language via an MCP client instead of typing commands.

## Prerequisites
- Node.js >= 18
- Litium Cloud CLI installed and in PATH (`which litium-cloud` returns a path)
- You have already logged in (`litium-cloud auth login` or service principal login)

## Install

### Option 1: Run with npx (Recommended for end users)
Once published to npm, users can run directly without cloning:
```bash
npx @litium/cloud-cli-mcp-server
```

### Option 2: Local Development
For contributing or testing:
```bash
cd cloud-cli-mcp-server
npm install
npm run dev
```

### Option 3: From Source
```bash
git clone https://github.com/tonnguyen/litium-admin-mcp-server.git
cd litium-admin-mcp-server/cloud-cli-mcp-server
npm install
npm run build
npm start
```

Starts HTTP server on `localhost:7070` exposing a JSON-RPC MCP endpoint at `POST /mcp`.

## Publishing to npm

**For maintainers:**

1. Update version in `package.json`:
```bash
npm version patch  # or minor, major
```

2. Build and publish:
```bash
npm run build
npm publish --access public
```

3. Users can then run:
```bash
npx @litium/cloud-cli-mcp-server
```

## Integration with AI Editors

### VS Code (GitHub Copilot)
1. Start the MCP server: `npm run dev`
2. Open VS Code Settings (JSON)
3. Add to `settings.json`:
```json
{
  "github.copilot.chat.codeGeneration.instructions": [
    {
      "text": "When managing Litium Cloud infrastructure, use the MCP server at http://localhost:7070/mcp"
    }
  ],
  "mcp.servers": {
    "litium-cloud-cli": {
      "transport": "http",
      "url": "http://localhost:7070/mcp"
    }
  }
}
```

### Claude Desktop (Anthropic)
1. Build the project: `npm run build`
2. Open Claude Desktop configuration file:
   - macOS: `~/Library/Application Support/Claude/claude_desktop_config.json`
   - Windows: `%APPDATA%\Claude\claude_desktop_config.json`
3. Add the server configuration:

**Option A: Using npx (recommended - after npm publish)**
```json
{
  "mcpServers": {
    "litium-cloud-cli": {
      "command": "npx",
      "args": ["-y", "@litium/cloud-cli-mcp-server"],
      "env": {
        "PORT": "7070"
      }
    }
  }
}
```

**Option B: Local development version**
```json
{
  "mcpServers": {
    "litium-cloud-cli": {
      "command": "npx",
      "args": ["-y", "litium-cloud-mcp-server"],
      "cwd": "/absolute/path/to/cloud-cli-mcp-server",
      "env": {
        "PORT": "7070"
      }
    }
  }
}
```

**Option C: Using node directly**
```json
{
  "mcpServers": {
    "litium-cloud-cli": {
      "command": "node",
      "args": ["/absolute/path/to/cloud-cli-mcp-server/dist/server.js"],
      "env": {
        "PORT": "7070"
      }
    }
  }
}
```
4. Restart Claude Desktop

### Cursor
1. Start the MCP server: `npm run dev`
2. Open Cursor Settings → Features → MCP Servers
3. Add new server:
   - **Name**: `litium-cloud-cli`
   - **URL**: `http://localhost:7070/mcp`
   - **Transport**: HTTP
4. Alternatively, edit Cursor settings JSON:
```json
{
  "mcp.servers": {
    "litium-cloud-cli": {
      "transport": "http",
      "url": "http://localhost:7070/mcp"
    }
  }
}
```
5. Restart Cursor

### Verifying Connection
After configuration, test by asking the AI:
- "List my Litium Cloud subscriptions"
- "Show current context"
- "Deploy app X with artifact Y"

The AI should automatically invoke the `cloud_cli` tool.

## Implemented Actions

### Context Management
- `set_context` - Store subscription/environment in-memory
- `show_context` - Display current context

### Subscriptions & Environments
- `list_subscriptions` - List all subscriptions
- `subscription_show` - Show subscription details
- `list_environments` - List environments (requires subscription context)

### Deployments & Jobs
- `deploy_app` - Deploy an app with artifact (requires appId, artifactId, subscription, environment)
- `job_status` - Get job status by jobId
- `job_logs_snapshot` - Fetch job logs (supports `follow: true` for tailing)
- `console_output` - Get console output for an app

### Artifacts
- `artifact_list` - List artifacts for subscription
- `artifact_show` - Show artifact details by artifactId
- `artifact_create` - Create new artifact (filePath, artifactType: dotnet|nextjs|sql|storage)

### Marketplace & Apps
- `marketplace_list` - List marketplace apps (optional filter, details flag)
- `manifest_generate` - Generate manifest YAML for an app
- `app_list` - List apps in environment

### Secrets
- `secret_create` - Create secret (scope: subscription|environment, secretId, value)
- `secret_list` - List secrets (scope: subscription|environment)

### Access Control
- `access_control_show` - Show access control for resource (subscription|environment|app)
- `access_control_add` - Grant access (email, role)
- `access_control_remove` - Revoke access (email, role)
- `access_control_disable_inheritance` - Disable inheritance for environment

### Roles & Service Principals
- `role_list` - List all available roles
- `role_show` - Show role details
- `service_principal_create` - Create service principal with certificate

### Audit
- `get_audit_logs` - Retrieve recent audit logs (limit parameter)

## JSON-RPC Request Shape
```json
{
  "jsonrpc": "2.0",
  "id": "1",
  "method": "tool.invoke",
  "params": {
    "toolName": "cloud_cli",
    "args": { "action": "list_subscriptions" }
  }
}
```

## Example curl

### Show context
```bash
curl -s -X POST http://localhost:7070/mcp \
  -H 'Content-Type: application/json' \
  -d '{"jsonrpc":"2.0","id":"1","method":"tool.invoke","params":{"toolName":"cloud_cli","args":{"action":"show_context"}}}' | jq
```

### List subscriptions
```bash
curl -s -X POST http://localhost:7070/mcp \
  -H 'Content-Type: application/json' \
  -d '{"jsonrpc":"2.0","id":"2","method":"tool.invoke","params":{"toolName":"cloud_cli","args":{"action":"list_subscriptions"}}}' | jq
```

### Set context
```bash
curl -s -X POST http://localhost:7070/mcp \
  -H 'Content-Type: application/json' \
  -d '{"jsonrpc":"2.0","id":"3","method":"tool.invoke","params":{"toolName":"cloud_cli","args":{"action":"set_context","subscriptionId":"<your-sub-id>","environmentId":"<your-env-id>"}}}' | jq
```

### Deploy app
```bash
curl -s -X POST http://localhost:7070/mcp \
  -H 'Content-Type: application/json' \
  -d '{"jsonrpc":"2.0","id":"4","method":"tool.invoke","params":{"toolName":"cloud_cli","args":{"action":"deploy_app","appId":"<app-id>","artifactId":"<artifact-id>"}}}' | jq
```

### Job status
```bash
curl -s -X POST http://localhost:7070/mcp \
  -H 'Content-Type: application/json' \
  -d '{"jsonrpc":"2.0","id":"5","method":"tool.invoke","params":{"toolName":"cloud_cli","args":{"action":"job_status","jobId":"<job-id>"}}}' | jq
```

### Job logs
```bash
curl -s -X POST http://localhost:7070/mcp \
  -H 'Content-Type: application/json' \
  -d '{"jsonrpc":"2.0","id":"6","method":"tool.invoke","params":{"toolName":"cloud_cli","args":{"action":"job_logs_snapshot","jobId":"<job-id>"}}}' | jq
```

### Stream logs via WebSocket
```bash
# Using websocat or similar WebSocket client
websocat "ws://localhost:7070/ws/logs?jobId=<job-id>"
```

### Access control
```bash
curl -s -X POST http://localhost:7070/mcp \
  -H 'Content-Type: application/json' \
  -d '{"jsonrpc":"2.0","id":"7","method":"tool.invoke","params":{"toolName":"cloud_cli","args":{"action":"access_control_show","resourceType":"subscription","subscriptionId":"<sub-id>"}}}' | jq
```

### Get audit logs
```bash
curl -s -X POST http://localhost:7070/mcp \
  -H 'Content-Type: application/json' \
  -d '{"jsonrpc":"2.0","id":"8","method":"tool.invoke","params":{"toolName":"cloud_cli","args":{"action":"get_audit_logs","limit":20}}}' | jq
```

## Roadmap
1. ✅ Deploy app / job status / logs snapshot
2. ✅ Artifact create/show/list
3. ✅ Marketplace list / manifest generate
4. ✅ Secret create/list
5. ✅ WebSocket streaming for log follow
6. ✅ Access control management (show/add/remove/disable-inheritance)
7. ✅ Role list/show
8. ✅ Service principal create
9. ✅ Audit logging with correlation IDs
10. 🔄 Rate limiting per client
11. 🔄 Metrics export (Prometheus)
12. 🔄 Role-based tool gating

## Notes
- Authentication errors return code `auth_required`.
- CLI stdout parsed as JSON when possible (using `-o json` on commands); otherwise returned as raw text lines.
- No secrets stored; context kept in-memory only.
- **Audit logging**: All tool invocations logged with timestamp, correlation ID, duration, success/failure.
- **WebSocket streaming**: Connect to `ws://localhost:7070/ws/logs?jobId=<id>` for real-time log follow.
- **Sensitive data**: Automatically redacted from audit logs (passwords, secrets, certificates).

## Safety
Commands are built from validated arguments. Arbitrary flag injection is disallowed.

## License
Same as parent repository.
