# Deploying Litium Admin MCP Server to Vercel

This guide explains how to deploy the Litium Admin MCP Server to Vercel as a serverless function.

## ⚠️ Important Considerations

**MCP Protocol Limitation**: The Model Context Protocol (MCP) is designed for persistent connections, while Vercel uses serverless functions. This deployment creates a **REST API wrapper** that provides MCP-like functionality through HTTP endpoints.

## 🚀 Deployment Steps

### 1. Prerequisites

- [Vercel account](https://vercel.com)
- [Vercel CLI](https://vercel.com/cli) installed
- Git repository with your code
- Litium Admin API credentials

### 2. Prepare Your Repository

Ensure your project structure includes:
```
├── api/
│   └── mcp.js              # Vercel serverless function
├── src/                    # Your source code
├── vercel.json            # Vercel configuration
├── package.json           # Dependencies
└── .env.example           # Environment variables template
```

### 3. Environment Variables

Set up the following environment variables in Vercel:

#### Required Variables
- `LITIUM_BASE_URL` - Your Litium instance URL (e.g., `https://demoadmin.litium.com`)
- `LITIUM_CLIENT_ID` - OAuth2 client ID
- `LITIUM_CLIENT_SECRET` - OAuth2 client secret

#### Optional Variables
- `MCP_SERVER_NAME` - Server name (default: `litium-admin-mcp-server`)
- `MCP_SERVER_VERSION` - Server version (default: `1.0.0`)

### 4. Deploy to Vercel

#### Option A: Using Vercel CLI

1. **Install Vercel CLI** (if not already installed):
   ```bash
   npm i -g vercel
   ```

2. **Login to Vercel**:
   ```bash
   vercel login
   ```

3. **Deploy from your project directory**:
   ```bash
   vercel
   ```

4. **Set environment variables**:
   ```bash
   vercel env add LITIUM_BASE_URL
   vercel env add LITIUM_CLIENT_ID
   vercel env add LITIUM_CLIENT_SECRET
   ```

5. **Redeploy with environment variables**:
   ```bash
   vercel --prod
   ```

#### Option B: Using Vercel Dashboard

1. **Connect your repository** to Vercel
2. **Set environment variables** in the Vercel dashboard
3. **Deploy** automatically on push to main branch

### 5. Verify Deployment

After deployment, test your server:

```bash
# Get server info and available tools
curl https://your-app.vercel.app/api/mcp

# List available tools
curl -X POST https://your-app.vercel.app/api/mcp \
  -H "Content-Type: application/json" \
  -d '{"action": "list_tools"}'

# Call a tool (example: search blocks)
curl -X POST https://your-app.vercel.app/api/mcp \
  -H "Content-Type: application/json" \
  -d '{
    "action": "call_tool",
    "tool": "search_blocks",
    "arguments": {
      "search": "test",
      "take": 10
    }
  }'
```

## 📡 API Endpoints

### GET `/api/mcp`
Returns server information and available tools.

**Response:**
```json
{
  "name": "Litium Admin MCP Server",
  "version": "1.0.0",
  "status": "running",
  "message": "MCP server is running on Vercel",
  "tools": [...]
}
```

### POST `/api/mcp`
Handles MCP-like requests.

#### List Tools
```json
{
  "action": "list_tools"
}
```

#### Call Tool
```json
{
  "action": "call_tool",
  "tool": "tool_name",
  "arguments": {
    "param1": "value1",
    "param2": "value2"
  }
}
```

## 🛠️ Available Tools

The server provides 20+ tools for interacting with Litium:

### Content Management
- `search_blocks` - Search content blocks
- `get_block` - Get specific block
- `create_block` - Create new block
- `update_block` - Update existing block
- `delete_block` - Delete block

### Product Management
- `search_products` - Search products
- `get_product` - Get specific product
- `create_product` - Create new product
- `update_product` - Update existing product
- `delete_product` - Delete product

### Customer Management
- `search_customers` - Search customers
- `get_customer` - Get specific customer
- `create_customer` - Create new customer
- `update_customer` - Update existing customer
- `delete_customer` - Delete customer

### Media Management
- `search_media` - Search media files
- `get_media_file` - Get specific media file

### Website Management
- `get_websites` - Get all websites
- `get_website` - Get specific website

### Order Management
- `search_orders` - Search orders
- `get_order` - Get specific order

## 🔧 Configuration

### Vercel Configuration (`vercel.json`)
```json
{
  "version": 2,
  "builds": [
    {
      "src": "api/mcp.js",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/api/(.*)",
      "dest": "/api/mcp"
    }
  ]
}
```

### Environment Variables
Set these in your Vercel dashboard or via CLI:

```bash
# Required
LITIUM_BASE_URL=https://your-litium-instance.com
LITIUM_CLIENT_ID=your_client_id
LITIUM_CLIENT_SECRET=your_client_secret

# Optional
MCP_SERVER_NAME=litium-admin-mcp-server
MCP_SERVER_VERSION=1.0.0
```

## 🚨 Limitations

### Serverless Constraints
- **Cold starts**: First request may be slower due to serverless cold start
- **Timeout**: Vercel functions have a 30-second timeout limit
- **Memory**: Limited to 1GB RAM per function
- **No persistent connections**: Each request is independent

### MCP Protocol Limitations
- **No real-time communication**: MCP is designed for persistent connections
- **Request/Response only**: No streaming or long-running operations
- **Authentication per request**: Tokens are refreshed for each request

## 🔍 Troubleshooting

### Common Issues

1. **Environment Variables Not Set**
   ```bash
   # Check if variables are set
   vercel env ls
   
   # Add missing variables
   vercel env add VARIABLE_NAME
   ```

2. **Build Failures**
   ```bash
   # Check build logs
   vercel logs
   
   # Test locally
   vercel dev
   ```

3. **Authentication Errors**
   - Verify `LITIUM_CLIENT_ID` and `LITIUM_CLIENT_SECRET`
   - Check `LITIUM_BASE_URL` is correct and accessible
   - Ensure your Litium instance allows API access

4. **Timeout Errors**
   - Vercel functions timeout after 30 seconds
   - Optimize your requests or use pagination
   - Consider breaking large operations into smaller chunks

### Debug Mode

Enable debug logging by setting:
```bash
vercel env add NODE_ENV development
```

## 🔄 Updates and Maintenance

### Updating the Server
1. **Push changes** to your repository
2. **Vercel automatically deploys** (if auto-deploy is enabled)
3. **Or manually deploy**:
   ```bash
   vercel --prod
   ```

### Monitoring
- Use **Vercel Analytics** to monitor performance
- Check **Function logs** in Vercel dashboard
- Monitor **API usage** and costs

## 💡 Alternative Deployment Options

If Vercel doesn't meet your needs, consider:

1. **Railway** - Better for persistent connections
2. **Render** - Good for MCP servers
3. **DigitalOcean App Platform** - Full control
4. **AWS Lambda** - More complex but powerful
5. **Self-hosted** - Complete control

## 📚 Additional Resources

- [Vercel Documentation](https://vercel.com/docs)
- [Vercel Functions](https://vercel.com/docs/functions)
- [MCP Protocol Specification](https://modelcontextprotocol.io)
- [Litium Admin API Documentation](https://docs.litium.com)

---

**Note**: This deployment creates a REST API wrapper around MCP functionality. For true MCP protocol support, consider deploying to a platform that supports persistent connections like Railway or Render.