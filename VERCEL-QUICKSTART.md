# 🚀 Quick Start: Deploy to Vercel

## Prerequisites
- Vercel account
- Vercel CLI installed: `npm i -g vercel`
- Litium Admin API credentials

## 1. One-Command Deployment

```bash
# Deploy with automatic setup
npm run deploy:vercel
```

## 2. Manual Deployment

### Step 1: Install Vercel CLI
```bash
npm i -g vercel
```

### Step 2: Login to Vercel
```bash
vercel login
```

### Step 3: Deploy
```bash
vercel
```

### Step 4: Set Environment Variables
```bash
vercel env add LITIUM_BASE_URL
vercel env add LITIUM_CLIENT_ID
vercel env add LITIUM_CLIENT_SECRET
```

### Step 5: Deploy to Production
```bash
vercel --prod
```

## 3. Test Your Deployment

```bash
# Test server info
curl https://your-app.vercel.app/api/mcp

# Test tool listing
curl -X POST https://your-app.vercel.app/api/mcp \
  -H "Content-Type: application/json" \
  -d '{"action": "list_tools"}'

# Test tool execution
curl -X POST https://your-app.vercel.app/api/mcp \
  -H "Content-Type: application/json" \
  -d '{
    "action": "call_tool",
    "tool": "search_blocks",
    "arguments": {"take": 5}
  }'
```

## 4. Environment Variables

Set these in Vercel dashboard or via CLI:

| Variable | Description | Required |
|----------|-------------|----------|
| `LITIUM_BASE_URL` | Your Litium instance URL | ✅ |
| `LITIUM_CLIENT_ID` | OAuth2 client ID | ✅ |
| `LITIUM_CLIENT_SECRET` | OAuth2 client secret | ✅ |
| `MCP_SERVER_NAME` | Server name | ❌ |
| `MCP_SERVER_VERSION` | Server version | ❌ |

## 5. Available Endpoints

- `GET /api/mcp` - Server info and tools
- `POST /api/mcp` - Execute MCP operations

## 6. Troubleshooting

### Common Issues

**❌ Build fails**
```bash
# Check build locally
npm run build
```

**❌ Environment variables not set**
```bash
# List current variables
vercel env ls

# Add missing variables
vercel env add VARIABLE_NAME
```

**❌ Authentication errors**
- Verify your Litium credentials
- Check the base URL is correct
- Ensure your Litium instance allows API access

### Debug Mode
```bash
# Enable debug logging
vercel env add NODE_ENV development
vercel --prod
```

## 7. Next Steps

1. **Test all tools** to ensure they work with your Litium instance
2. **Monitor usage** in Vercel dashboard
3. **Set up monitoring** for production use
4. **Configure custom domain** if needed

## 📚 Full Documentation

For detailed information, see [DEPLOYMENT.md](./DEPLOYMENT.md)

---

**Need help?** Check the troubleshooting section or create an issue in the repository.