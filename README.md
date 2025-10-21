# Litium Admin MCP Server

A Model Context Protocol (MCP) server that provides AI models with tools to interact with the Litium Admin Web API. This server enables AI assistants to manage content blocks, products, customers, media files, websites, and orders in Litium e-commerce platforms.

## Features

- 🔐 **Secure Authentication**: OAuth2 client credentials flow with automatic token management
- 📦 **Content Management**: Create, read, update, and delete content blocks
- 🛍️ **Product Management**: Full CRUD operations for products
- 👥 **Customer Management**: Manage customer data and organizations
- 🖼️ **Media Management**: Handle media files and assets
- 🌐 **Website Management**: Access website configurations
- 📊 **Order Management**: View and manage sales orders
- 🔍 **Advanced Search**: Search across all entities with pagination and sorting
- ⚡ **TypeScript**: Fully typed with generated types from OpenAPI specification
- 🛡️ **Error Handling**: Comprehensive error handling and logging

## Prerequisites

- Node.js 18.0.0 or higher
- A Litium Admin API account with client credentials
- Access to a Litium instance (e.g., demoadmin.litium.com)

## Installation

1. **Clone or download this repository**
   ```bash
   git clone <repository-url>
   cd litium-admin-mcp-server
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configuration**
   
   This MCP server is **configuration-agnostic**. Users configure it when adding to their AI model:
   
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

4. **Build the project**
   ```bash
   npm run build
   ```

## Usage

### Running the Server

```bash
# Development mode (with auto-reload)
npm run dev

# Production mode
npm start
```

### Available Tools

The MCP server provides the following tools for AI models:

#### Configuration
- `configure_litium` - Configure Litium API credentials (required first)

#### Content Blocks
- `search_blocks` - Search for content blocks with optional filters
- `get_block` - Get a specific block by system ID
- `create_block` - Create a new content block
- `update_block` - Update an existing content block
- `delete_block` - Delete a content block

#### Products
- `search_products` - Search for products with optional filters
- `get_product` - Get a specific product by system ID
- `create_product` - Create a new product
- `update_product` - Update an existing product
- `delete_product` - Delete a product

#### Customers
- `search_customers` - Search for customers with optional filters
- `get_customer` - Get a specific customer by system ID
- `create_customer` - Create a new customer
- `update_customer` - Update an existing customer
- `delete_customer` - Delete a customer

#### Media Files
- `search_media` - Search for media files with optional filters
- `get_media_file` - Get a specific media file by system ID

#### Websites
- `get_websites` - Get all websites
- `get_website` - Get a specific website by system ID

#### Orders
- `search_orders` - Search for orders with optional filters
- `get_order` - Get a specific order by system ID

### Tool Parameters

Most search tools support the following optional parameters:
- `search` (string): Search term for filtering results
- `skip` (number): Number of items to skip for pagination (default: 0)
- `take` (number): Number of items to return (default: 20)
- `sort` (string): Sort order for results

## Configuration

### Environment Variables

| Variable | Description | Required | Default |
|----------|-------------|----------|---------|
| `LITIUM_BASE_URL` | Base URL of your Litium instance | Yes | - |
| `LITIUM_CLIENT_ID` | OAuth2 client ID | Yes | - |
| `LITIUM_CLIENT_SECRET` | OAuth2 client secret | Yes | - |
| `MCP_SERVER_NAME` | Name of the MCP server | No | `litium-admin-mcp-server` |
| `MCP_SERVER_VERSION` | Version of the MCP server | No | `1.0.0` |

### Logging

The server includes comprehensive logging with different levels:
- `ERROR`: Critical errors that prevent operation
- `WARN`: Warning messages for potential issues
- `INFO`: General information about server operation
- `DEBUG`: Detailed debugging information

Set `NODE_ENV=development` to enable debug logging.

## Development

### Project Structure

```
src/
├── auth/                 # Authentication and token management
│   └── token-manager.ts
├── services/             # API service layer
│   └── litium-api.ts
├── types/                # TypeScript type definitions
│   ├── api.ts           # Generated from OpenAPI spec
│   ├── auth.ts          # Authentication types
│   └── config.ts        # Configuration types
├── utils/                # Utility functions
│   ├── config.ts        # Configuration management
│   ├── error-handler.ts # Error handling utilities
│   └── logger.ts        # Logging utilities
└── index.ts             # Main MCP server implementation
```

### Available Scripts

- `npm run build` - Compile TypeScript to JavaScript
- `npm run start` - Run the compiled server
- `npm run dev` - Run in development mode with auto-reload
- `npm run generate-types` - Regenerate TypeScript types from OpenAPI spec
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix ESLint issues automatically

### Adding New Tools

To add new tools to the MCP server:

1. Add the tool definition to the `tools` array in `src/index.ts`
2. Implement the corresponding method in `src/services/litium-api.ts`
3. Add a case in the tool handler switch statement in `src/index.ts`

## Error Handling

The server includes comprehensive error handling:

- **Authentication Errors**: Invalid credentials or expired tokens
- **Configuration Errors**: Missing or invalid environment variables
- **API Errors**: HTTP errors from the Litium API
- **Validation Errors**: Invalid input parameters

All errors are logged and returned to the client in a consistent format.

## Security

- All API requests use OAuth2 bearer tokens
- Tokens are automatically refreshed before expiration
- Sensitive configuration is loaded from environment variables
- No credentials are logged or exposed in error messages

## Troubleshooting

### Common Issues

1. **Authentication Failed**
   - Verify your `LITIUM_CLIENT_ID` and `LITIUM_CLIENT_SECRET`
   - Ensure your Litium instance is accessible
   - Check that your client has the necessary permissions

2. **Configuration Error**
   - Ensure all required environment variables are set
   - Verify the `LITIUM_BASE_URL` is correct and accessible

3. **API Errors**
   - Check the Litium API documentation for endpoint requirements
   - Verify your client has permissions for the requested operations
   - Check the server logs for detailed error information

### Debug Mode

Enable debug logging by setting `NODE_ENV=development`:

```bash
NODE_ENV=development npm run dev
```

## License

MIT License - see LICENSE file for details.

## Support

For issues and questions:
1. Check the troubleshooting section above
2. Review the server logs for error details
3. Consult the Litium Admin API documentation
4. Create an issue in this repository

## Contributing

Contributions are welcome! Please:
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

---

**Note**: This MCP server is designed to work with Litium Admin Web API. Ensure you have proper permissions and access to the Litium instance before using this server in production.