# Configuration Guide

## 🎯 Overview

The Litium Admin MCP Server is designed to be **configuration-agnostic**. This means:

- ✅ **No environment variables** required
- ✅ **No hardcoded credentials** in the code
- ✅ **User configures** when adding to their AI model
- ✅ **Secure** - credentials never stored in the server

## 🔧 How Configuration Works

### 1. **MCP Tool Configuration**

Users configure the server by calling the `configure_litium` tool first:

```json
{
  "tool": "configure_litium",
  "arguments": {
    "baseUrl": "https://your-litium-instance.com",
    "clientId": "your_oauth2_client_id",
    "clientSecret": "your_oauth2_client_secret"
  }
}
```

### 2. **Configuration Flow**

```
1. User adds MCP server to AI model (Claude, Cursor, etc.)
2. AI model calls configure_litium tool with user's credentials
3. Server validates and stores configuration in memory
4. User can now call other tools (search_blocks, get_products, etc.)
5. All tools use the configured credentials
```

## 🛠️ Setup Instructions

### For AI Model Integration

When integrating this MCP server with an AI model:

1. **Add the MCP server** to your AI model configuration
2. **Configure credentials** by calling the `configure_litium` tool
3. **Start using** other tools immediately

### Example Integration

```typescript
// In your AI model configuration
const mcpServer = {
  name: "litium-admin-mcp-server",
  url: "https://your-vercel-app.vercel.app/api/mcp",
  tools: ["configure_litium", "search_blocks", "get_products", ...]
};

// First, configure the server
await callTool("configure_litium", {
  baseUrl: "https://demoadmin.litium.com",
  clientId: "your_client_id",
  clientSecret: "your_client_secret"
});

// Then use other tools
const blocks = await callTool("search_blocks", { search: "homepage" });
const products = await callTool("search_products", { take: 10 });
```

## 🔐 Security Benefits

### Why This Approach is Better

1. **No Credential Storage**: Credentials are never stored in the server
2. **Per-Session Configuration**: Each AI model session configures independently
3. **No Environment Variables**: No risk of accidentally committing credentials
4. **User Control**: Users control their own credentials
5. **Stateless**: Server doesn't maintain persistent configuration

### Security Best Practices

- ✅ **Use OAuth2 Client Credentials** (not user credentials)
- ✅ **Rotate credentials regularly**
- ✅ **Use least-privilege access**
- ✅ **Monitor API usage**

## 📋 Required Credentials

### Litium Admin API Access

You need these credentials from your Litium instance:

| Credential | Description | Example |
|------------|-------------|---------|
| `baseUrl` | Your Litium instance URL | `https://demoadmin.litium.com` |
| `clientId` | OAuth2 Client ID | `abc123def456` |
| `clientSecret` | OAuth2 Client Secret | `secret789xyz` |

### Getting Credentials

1. **Access Litium Admin** → Settings → API
2. **Create OAuth2 Application** (if not exists)
3. **Copy Client ID and Secret**
4. **Note your instance URL**

## 🚀 Available Tools

### Configuration Tool

- **`configure_litium`** - Set up Litium API credentials

### Content Management

- **`search_blocks`** - Search content blocks
- **`get_block`** - Get specific block
- **`create_block`** - Create new block
- **`update_block`** - Update existing block
- **`delete_block`** - Delete block

### Product Management

- **`search_products`** - Search products
- **`get_product`** - Get specific product
- **`create_product`** - Create new product
- **`update_product`** - Update existing product
- **`delete_product`** - Delete product

### Customer Management

- **`search_customers`** - Search customers
- **`get_customer`** - Get specific customer
- **`create_customer`** - Create new customer
- **`update_customer`** - Update existing customer
- **`delete_customer`** - Delete customer

### Media Management

- **`search_media`** - Search media files
- **`get_media_file`** - Get specific media file

### Website Management

- **`get_websites`** - Get all websites
- **`get_website`** - Get specific website

### Order Management

- **`search_orders`** - Search sales orders
- **`get_order`** - Get specific order

## 🔄 Configuration Lifecycle

### Session-Based Configuration

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   AI Model      │    │   MCP Server     │    │   Litium API    │
│                 │    │                  │    │                 │
│ 1. configure_   │───▶│ 2. Store config  │    │                 │
│    litium       │    │    in memory     │    │                 │
│                 │    │                  │    │                 │
│ 3. search_      │───▶│ 4. Use stored    │───▶│ 5. API calls    │
│    blocks       │    │    config        │    │    with auth    │
│                 │    │                  │    │                 │
│ 6. get_products │───▶│ 7. Use stored    │───▶│ 8. API calls    │
│                 │    │    config        │    │    with auth    │
└─────────────────┘    └──────────────────┘    └─────────────────┘
```

### Configuration Validation

The server validates credentials on configuration:

- ✅ **URL Format**: Must be valid URL
- ✅ **Client ID**: Must be non-empty string
- ✅ **Client Secret**: Must be non-empty string
- ✅ **API Access**: Tests connection to Litium API

## 🚨 Error Handling

### Common Configuration Errors

| Error | Cause | Solution |
|-------|-------|----------|
| `Invalid URL format` | baseUrl is malformed | Use valid URL (e.g., `https://domain.com`) |
| `Client ID required` | clientId is empty | Provide valid OAuth2 client ID |
| `Client Secret required` | clientSecret is empty | Provide valid OAuth2 client secret |
| `API connection failed` | Credentials invalid | Check credentials and API access |

### Error Response Format

```json
{
  "content": [
    {
      "type": "text",
      "text": "Error: Please configure Litium API credentials first using the configure_litium tool."
    }
  ],
  "isError": true
}
```

## 💡 Best Practices

### For AI Model Developers

1. **Always configure first** before using other tools
2. **Handle configuration errors** gracefully
3. **Re-configure** if credentials change
4. **Validate responses** for configuration status

### For End Users

1. **Use OAuth2 credentials** (not user passwords)
2. **Keep credentials secure** in your AI model configuration
3. **Test configuration** with a simple tool call first
4. **Contact admin** if you need API access

## 🔍 Troubleshooting

### Configuration Not Working

1. **Check credentials** are correct
2. **Verify API access** in Litium Admin
3. **Test URL** is accessible
4. **Check OAuth2 application** is active

### Tools Not Working

1. **Ensure configuration** was successful
2. **Check error messages** for specific issues
3. **Verify permissions** for the API endpoints
4. **Test with simple tools** first

## 📚 Next Steps

1. **Integrate** with your AI model
2. **Configure** with your Litium credentials
3. **Test** with basic tools
4. **Explore** advanced features
5. **Monitor** usage and performance

---

**Need help?** Check the troubleshooting section or create an issue in the repository.