#!/bin/bash

# Deploy Litium Admin MCP Server to Vercel
# This script helps automate the deployment process

set -e

echo "🚀 Deploying Litium Admin MCP Server to Vercel..."

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "❌ Vercel CLI is not installed. Please install it first:"
    echo "   npm i -g vercel"
    exit 1
fi

# Check if user is logged in
if ! vercel whoami &> /dev/null; then
    echo "🔐 Please log in to Vercel first:"
    echo "   vercel login"
    exit 1
fi

# Build the project
echo "📦 Building project..."
npm run build

# Deploy to Vercel
echo "🚀 Deploying to Vercel..."
vercel --prod

echo "✅ Deployment complete!"
echo ""
echo "📝 Next steps:"
echo "1. Set environment variables in Vercel dashboard:"
echo "   - LITIUM_BASE_URL"
echo "   - LITIUM_CLIENT_ID" 
echo "   - LITIUM_CLIENT_SECRET"
echo ""
echo "2. Test your deployment:"
echo "   curl https://your-app.vercel.app/api/mcp"
echo ""
echo "3. Check the deployment documentation:"
echo "   cat DEPLOYMENT.md"