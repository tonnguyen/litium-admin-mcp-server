# Litium Admin MCP Server

A **HTTP-based** Model Context Protocol (MCP) server built with Next.js that provides AI models with programmatic access to the Litium e-commerce platform's Admin Web API.

🚀 **Deployed on Vercel** • 🔗 **HTTP Transport** • 🎯 **18 Domain-Based Tools**

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/yourusername/litium-admin-mcp-server)

## ✨ Features

- **18 Consolidated Tools** - Organized by domain (Products, Content, Media, etc.)
- **HTTP-Based** - Works with Cursor and other MCP clients that support HTTP transport
- **Vercel Deployment** - Production-ready serverless deployment
- **Team-Friendly** - Centralized server, no local installation needed
- **Modular Architecture** - Clean, maintainable code structure

## 🚀 Quick Start

### For Users (Cursor/Claude Desktop)

Simply configure the MCP server in your client:

**Cursor** (`.cursor/mcp.json`):
```json
{
  "mcpServers": {
    "litium-admin": {
      "url": "https://litium-admin-mcp-server.vercel.app/api/mcp",
      "headers": {
        "X-Litium-Base-Url": "https://demoadmin.litium.com",
        "X-Litium-Client-Id": "your-client-id",
        "X-Litium-Client-Secret": "your-client-secret"
      }
    }
  }
}
```

That's it! No local installation required.

### For Developers

#### Local Development

```bash
# Clone the repository
git clone https://github.com/yourusername/litium-admin-mcp-server.git
cd litium-admin-mcp-server

# Install dependencies
npm install

# Start development server
npm run dev

# Server will be at http://localhost:3000
# MCP endpoint: http://localhost:3000/api/mcp
```

#### Deploy to Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
npm run deploy
```

Or use the "Deploy with Vercel" button above.

## 🎯 Available Tools (18 Total)

### Products Domain (6 tools)
- `manage_product` - Search, get, create, update, delete products; get variants
- `manage_product_variant` - Manage product variants
- `manage_product_category` - Manage categories and subcategories
- `manage_product_assortment` - Manage product assortments
- `manage_price_list` - Manage price lists and items
- `manage_relationship_type` - Manage product relationships (cross-sell, up-sell)

### Content Domain (2 tools)
- `manage_block` - Manage content blocks
- `manage_page` - Manage pages (published and drafts)

### Media Domain (1 tool)
- `manage_media` - Manage media files and folders

### Websites Domain (1 tool)
- `manage_website` - Manage websites and URL redirects

### Customers Domain (1 tool)
- `manage_customer` - Manage customers

### Sales Domain (1 tool)
- `manage_order` - View orders (read-only)

### Globalization Domain (5 tools)
- `manage_channel` - Manage channels
- `manage_country` - Manage countries
- `manage_currency` - Manage currencies
- `manage_language` - Manage languages
- `manage_market` - Manage markets

### API Info (1 tool)
- `get_api_info` - Get API documentation and endpoint information

## 📖 Usage Examples

### Search Products
```json
{
  "tool": "manage_product",
  "arguments": {
    "operation": "search",
    "params": {
      "search": "laptop",
      "take": 10
    }
  }
}
```

### Get Product by ID
```json
{
  "tool": "manage_product",
  "arguments": {
    "operation": "get",
    "systemId": "abc-123-def"
  }
}
```

### Create a Content Block
```json
{
  "tool": "manage_block",
  "arguments": {
    "operation": "create",
    "data": {
      "name": "Hero Banner",
      "content": "..."
    }
  }
}
```

## 🔧 Configuration

### Required Headers

The server requires these HTTP headers with each request:

| Header | Description | Example |
|--------|-------------|---------|
| `X-Litium-Base-Url` | Litium instance URL | `https://demoadmin.litium.com` |
| `X-Litium-Client-Id` | OAuth2 Client ID | `your-client-id` |
| `X-Litium-Client-Secret` | OAuth2 Client Secret | `your-client-secret` |

### Getting Litium API Credentials

1. Log in to your Litium Admin panel
2. Go to **Settings** → **API Clients**
3. Create a new API client
4. Copy the Client ID and Client Secret

## 🏗️ Architecture

```
litium-admin-mcp-server/
├── app/api/[transport]/
│   ├── route.ts              # Main HTTP handler (61 lines)
│   └── tools/                # Tool handlers by domain
│       ├── products.ts       # Product domain tools
│       ├── content.ts        # Content domain tools
│       ├── media.ts          # Media domain tools
│       ├── websites.ts       # Website domain tools
│       ├── commerce.ts       # Commerce domain tools
│       ├── globalization.ts  # Globalization domain tools
│       ├── api-info.ts       # API info tools
│       └── index.ts          # Tool registration
│
├── src/
│   ├── services/             # API service implementations
│   ├── auth/                 # OAuth2 token management
│   ├── types/                # TypeScript type definitions
│   └── utils/                # Utilities (config, logging, etc.)
│
└── docs/                     # Documentation
```

## 🔍 Key Technologies

- **Next.js 15** - React framework for serverless deployment
- **mcp-handler** - HTTP transport adapter for MCP protocol
- **Zod** - Schema validation
- **TypeScript** - Type safety
- **Vercel** - Serverless hosting platform

## 📚 Documentation

Full documentation is available in the `/docs` directory:

- [Getting Started](docs/getting-started/installation.mdx)
- [Authentication](docs/getting-started/authentication.mdx)
- [Tool Reference](docs/tools/overview.mdx)
- [Deployment Guide](docs/guides/deployment.mdx)

## 🤝 Contributing

Contributions are welcome! Please see the [ARCHITECTURE_UPDATE.md](ARCHITECTURE_UPDATE.md) for details on the codebase structure.

### Adding a New Tool

1. Create handler in appropriate `app/api/[transport]/tools/*.ts` file
2. Register in `app/api/[transport]/tools/index.ts`
3. Deploy to Vercel

See [ARCHITECTURE_UPDATE.md](ARCHITECTURE_UPDATE.md) for detailed instructions.

## 📄 License

MIT License - see [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built with [Model Context Protocol](https://modelcontextprotocol.io/)
- Powered by [Litium](https://www.litium.com/) e-commerce platform
- Deployed on [Vercel](https://vercel.com/)

---

**Questions?** Open an issue or check the [documentation](docs/).

**Need help?** See [Troubleshooting Guide](docs/guides/troubleshooting.mdx).
