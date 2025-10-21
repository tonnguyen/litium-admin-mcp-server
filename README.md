# Litium Admin MCP Server

A Model Context Protocol (MCP) server built with **Next.js** and **mcp-handler** that provides AI models with programmatic access to the Litium e-commerce platform's Admin Web API.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/yourusername/litium-admin-mcp-server)

## 🚀 Quick Start

### Prerequisites

- Node.js 18 or later
- Litium instance with Admin Web API access
- OAuth2 credentials (Client ID and Client Secret)

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/litium-admin-mcp-server.git
cd litium-admin-mcp-server

# Install dependencies
npm install
```

### Development

```bash
# Start the Next.js development server
npm run dev

# Server will be available at http://localhost:3000
# MCP endpoint: http://localhost:3000/api/mcp
```

### Deployment to Vercel

```bash
# Deploy to production
npm run deploy
```

Or click the "Deploy with Vercel" button above.

## 📋 Features

### Available Tools (21 Total)

#### Content Blocks (5 tools)
- `search_blocks` - Search for content blocks
- `get_block` - Get a specific block by ID
- `create_block` - Create a new content block
- `update_block` - Update an existing block
- `delete_block` - Delete a content block

#### Products (5 tools)
- `search_products` - Search for products
- `get_product` - Get a specific product by ID
- `create_product` - Create a new product
- `update_product` - Update an existing product
- `delete_product` - Delete a product

#### Customers (5 tools)
- `search_customers` - Search for customers
- `get_customer` - Get a specific customer by ID
- `create_customer` - Create a new customer
- `update_customer` - Update an existing customer
- `delete_customer` - Delete a customer

#### Media (2 tools)
- `search_media` - Search for media files
- `get_media` - Get a specific media file by ID

#### Websites (2 tools)
- `get_websites` - Get all websites
- `get_website` - Get a specific website by ID

#### Orders (2 tools)
- `search_orders` - Search for sales orders
- `get_order` - Get a specific order by ID

## 🔧 Configuration

### Client Configuration

The server uses **header-based credential management** (similar to GitHub MCP server). Credentials are passed via HTTP headers with each request.

#### Cursor Configuration (`.cursor/mcp.json`)

```json
{
  "mcpServers": {
    "litium-admin": {
      "url": "https://your-deployment.vercel.app/api/mcp",
      "headers": {
        "X-Litium-Base-Url": "${input:litium_base_url}",
        "X-Litium-Client-Id": "${input:litium_client_id}",
        "X-Litium-Client-Secret": "${input:litium_client_secret}"
      }
    }
  },
  "inputs": [
    {
      "type": "promptString",
      "id": "litium_base_url",
      "description": "Litium instance base URL (e.g., https://demoadmin.litium.com)"
    },
    {
      "type": "promptString",
      "id": "litium_client_id",
      "description": "Litium OAuth2 Client ID"
    },
    {
      "type": "promptString",
      "id": "litium_client_secret",
      "description": "Litium OAuth2 Client Secret",
      "password": true
    }
  ]
}
```

#### Claude Desktop Configuration

For Claude Desktop, you need to use `mcp-remote` to proxy the HTTP connection:

```json
{
  "mcpServers": {
    "litium-admin": {
      "command": "npx",
      "args": [
        "-y",
        "mcp-remote",
        "https://your-deployment.vercel.app/api/mcp"
      ],
      "env": {
        "MCP_HEADER_X_LITIUM_BASE_URL": "https://demoadmin.litium.com",
        "MCP_HEADER_X_LITIUM_CLIENT_ID": "your-client-id",
        "MCP_HEADER_X_LITIUM_CLIENT_SECRET": "your-client-secret"
      }
    }
  }
}
```

See [claude_desktop_config.json.example](./claude_desktop_config.json.example) for a complete example.

### Testing with cURL

```bash
curl -X POST http://localhost:3000/api/mcp \
  -H "Content-Type: application/json" \
  -H "Accept: application/json, text/event-stream" \
  -H "X-Litium-Base-Url: https://demoadmin.litium.com" \
  -H "X-Litium-Client-Id: your-client-id" \
  -H "X-Litium-Client-Secret: your-client-secret" \
  -d '{"jsonrpc":"2.0","method":"tools/list","id":1}'
```

### Testing with Postman

1. **Method**: POST
2. **URL**: `http://localhost:3000/api/mcp`
3. **Headers**:
   - `Content-Type`: `application/json`
   - `Accept`: `application/json, text/event-stream`
   - `X-Litium-Base-Url`: `https://demoadmin.litium.com`
   - `X-Litium-Client-Id`: `your-client-id`
   - `X-Litium-Client-Secret`: `your-client-secret`
4. **Body** (raw JSON):
   ```json
   {
     "jsonrpc": "2.0",
     "method": "tools/list",
     "id": 1
   }
   ```

## 🏗️ Architecture

### Technology Stack

- **Framework**: Next.js 15.5+
- **Runtime**: Node.js 18+
- **Language**: TypeScript 5.7+
- **MCP Handler**: `mcp-handler` (Vercel's official MCP adapter)
- **MCP SDK**: `@modelcontextprotocol/sdk` 1.20+
- **Schema Validation**: Zod 3.22
- **HTTP Client**: Axios 1.12+
- **Deployment**: Vercel (serverless)

### Project Structure

```
litium-admin-mcp-server/
├── app/                          # Next.js App Router
│   ├── api/
│   │   └── [transport]/          # MCP endpoint (dynamic routing)
│   │       └── route.ts          # Main MCP handler with mcp-handler
│   ├── layout.tsx                # Root layout
│   └── page.tsx                  # Homepage
├── src/                          # Source code
│   ├── auth/
│   │   └── token-manager.ts      # OAuth2 token management
│   ├── services/                 # API service layer
│   │   ├── base-api.ts           # Base service class
│   │   ├── litium-api.ts         # Main API service
│   │   ├── blocks/               # Content blocks service
│   │   ├── products/             # Products service
│   │   ├── customers/            # Customers service
│   │   ├── media/                # Media service
│   │   ├── websites/             # Websites service
│   │   └── orders/               # Orders service
│   ├── types/                    # TypeScript types
│   └── utils/                    # Utility functions
├── next.config.mjs               # Next.js configuration
├── vercel.json                   # Vercel deployment config
├── package.json                  # Dependencies & scripts
└── tsconfig.json                 # TypeScript config
```

### How It Works

```
┌─────────────────────────────────────────────────┐
│  MCP Client (Cursor/Claude/Postman)             │
│  - Sends credentials via HTTP headers           │
│  - Makes JSON-RPC requests over HTTPS           │
└──────────────────┬──────────────────────────────┘
                   │ HTTPS + SSE
                   ▼
┌─────────────────────────────────────────────────┐
│  Next.js on Vercel                               │
│  ┌───────────────────────────────────────────┐  │
│  │ app/api/[transport]/route.ts              │  │
│  │  - mcp-handler (SSE transport)            │  │
│  │  - Extract credentials from headers       │  │
│  │  - Create isolated API service            │  │
│  └────────────────┬──────────────────────────┘  │
│                   │                              │
│  ┌────────────────▼──────────────────────────┐  │
│  │ LitiumApiService (per request)            │  │
│  │  - OAuth2 authentication                  │  │
│  │  - Domain services (blocks, products...)  │  │
│  └────────────────┬──────────────────────────┘  │
└───────────────────┼──────────────────────────────┘
                    │ HTTPS + OAuth2 Bearer Token
                    ▼
┌─────────────────────────────────────────────────┐
│  Litium Admin Web API                            │
│  - Returns e-commerce data                       │
└─────────────────────────────────────────────────┘
```

## 🔐 Security

### Credential Management

- **No Server-Side Storage**: Credentials are never stored on the server
- **Per-Request Authentication**: Each request creates a new isolated API service
- **Stateless**: No session state maintained
- **HTTPS Only**: All communications encrypted in transit
- **OAuth2**: Uses client credentials grant flow for API authentication

### Headers

The following custom headers are used to pass Litium credentials:

- `X-Litium-Base-Url`: Your Litium instance URL
- `X-Litium-Client-Id`: OAuth2 client ID
- `X-Litium-Client-Secret`: OAuth2 client secret

## 📚 Documentation

- [ARCHITECTURE.md](./ARCHITECTURE.md) - Detailed architecture documentation
- [Vercel MCP Docs](https://vercel.com/docs/mcp) - Vercel's MCP deployment guide
- [MCP Specification](https://modelcontextprotocol.io/) - Model Context Protocol specification
- [Litium API Docs](https://docs.litium.com/) - Litium Admin Web API documentation

## 🛠️ Development

### Available Scripts

```bash
# Development server (with hot reload)
npm run dev

# Production build
npm run build

# Start production server
npm start

# Run linter
npm run lint

# Fix linting issues
npm run lint:fix

# Deploy to Vercel
npm run deploy

# Generate TypeScript types from OpenAPI spec
npm run generate-types
```

### Local Development

1. Start the development server:
   ```bash
   npm run dev
   ```

2. The server will be available at `http://localhost:3000`

3. Visit `http://localhost:3000` to see the status page

4. The MCP endpoint is at `http://localhost:3000/api/mcp`

### Environment Variables

No environment variables are required for deployment. Credentials are passed via HTTP headers from the client.

For local development or testing, you can optionally use:

```bash
# .env.local (for testing only, not used in production)
LITIUM_BASE_URL=https://demoadmin.litium.com
LITIUM_CLIENT_ID=your-client-id
LITIUM_CLIENT_SECRET=your-client-secret
```

## 🚢 Deployment

### Vercel (Recommended)

1. **Via CLI**:
   ```bash
   npm run deploy
   ```

2. **Via GitHub**:
   - Push your code to GitHub
   - Import the repository in Vercel
   - Deploy automatically on push

3. **Via Button**:
   - Click the "Deploy with Vercel" button at the top

### Configuration

The `vercel.json` file configures the deployment:

```json
{
  "buildCommand": "next build",
  "framework": "nextjs",
  "headers": [
    {
      "source": "/api/mcp",
      "headers": [
        { "key": "Access-Control-Allow-Origin", "value": "*" },
        { "key": "Access-Control-Allow-Methods", "value": "GET, POST, DELETE, OPTIONS" },
        { "key": "Access-Control-Allow-Headers", "value": "Content-Type, Authorization, X-Litium-Base-Url, X-Litium-Client-Id, X-Litium-Client-Secret" }
      ]
    }
  ]
}
```

### Other Platforms

The application can also be deployed to:
- **Docker**: Containerize with Next.js
- **AWS Lambda**: Using serverless-next.js
- **Google Cloud Run**: Container-based deployment
- **Azure**: App Service or Container Instances

## 🧪 Testing

### Test Tools List

```bash
curl -X POST http://localhost:3000/api/mcp \
  -H "Content-Type: application/json" \
  -H "Accept: application/json, text/event-stream" \
  -H "X-Litium-Base-Url: https://demoadmin.litium.com" \
  -H "X-Litium-Client-Id: your-client-id" \
  -H "X-Litium-Client-Secret: your-client-secret" \
  -d '{"jsonrpc":"2.0","method":"tools/list","id":1}'
```

### Test Calling a Tool

```bash
curl -X POST http://localhost:3000/api/mcp \
  -H "Content-Type: application/json" \
  -H "Accept: application/json, text/event-stream" \
  -H "X-Litium-Base-Url: https://demoadmin.litium.com" \
  -H "X-Litium-Client-Id: your-client-id" \
  -H "X-Litium-Client-Secret: your-client-secret" \
  -d '{
    "jsonrpc": "2.0",
    "method": "tools/call",
    "params": {
      "name": "get_websites",
      "arguments": {}
    },
    "id": 2
  }'
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Model Context Protocol](https://modelcontextprotocol.io/) by Anthropic
- [Vercel](https://vercel.com/) for mcp-handler and deployment platform
- [Litium](https://www.litium.com/) for the e-commerce platform
- [Next.js](https://nextjs.org/) for the React framework

## 📞 Support

- **Issues**: [GitHub Issues](https://github.com/yourusername/litium-admin-mcp-server/issues)
- **Documentation**: [Litium Docs](https://docs.litium.com/)
- **MCP Specification**: [modelcontextprotocol.io](https://modelcontextprotocol.io/)

## 🔄 Version History

### v3.0.0 (Current) - Next.js Migration
- ✅ Migrated to Next.js + mcp-handler
- ✅ HTTP/SSE transport for remote access
- ✅ Header-based credential management
- ✅ Vercel serverless deployment
- ✅ Dynamic routing with `[transport]`
- ✅ 21 tools across 6 domains

### v2.0.0 - Service Layer Refactoring
- Introduced domain-driven service architecture
- Split services by business domains
- Added base service class for common functionality

### v1.0.0 - Initial Release
- Basic MCP server with stdio transport
- CRUD operations for Litium resources
- OAuth2 authentication

---

Made with ❤️ by [Ton Nguyen](https://github.com/tonnguyen)
