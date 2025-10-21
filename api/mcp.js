// Vercel serverless function for Litium Admin MCP Server
import { LitiumApiService } from '../src/services/litium-api.js';
import { createLitiumConfig, createMCPConfig } from '../src/utils/config.js';
import { logger } from '../src/utils/logger.js';
import { handleError, formatErrorForMCP } from '../src/utils/error-handler.js';

// Initialize API service
let apiService = null;

function initializeApiService(litiumConfig) {
  try {
    const config = createLitiumConfig(litiumConfig);
    apiService = new LitiumApiService(config);
    return apiService;
  } catch (error) {
    const apiError = handleError(error);
    logger.error('Failed to initialize API service:', apiError);
    throw apiError;
  }
}

// Available tools configuration
const tools = [
  {
    name: 'configure_litium',
    description: 'Configure Litium API credentials for the MCP server',
    inputSchema: {
      type: 'object',
      properties: {
        baseUrl: { type: 'string', description: 'Litium instance base URL (e.g., https://demoadmin.litium.com)' },
        clientId: { type: 'string', description: 'OAuth2 client ID for Litium API access' },
        clientSecret: { type: 'string', description: 'OAuth2 client secret for Litium API access' },
      },
      required: ['baseUrl', 'clientId', 'clientSecret'],
    },
  },
  {
    name: 'search_blocks',
    description: 'Search for content blocks in Litium',
    inputSchema: {
      type: 'object',
      properties: {
        search: { type: 'string', description: 'Search term for filtering blocks' },
        skip: { type: 'number', description: 'Number of items to skip (for pagination)', default: 0 },
        take: { type: 'number', description: 'Number of items to return (for pagination)', default: 20 },
        sort: { type: 'string', description: 'Sort order for results' },
      },
    },
  },
  {
    name: 'get_block',
    description: 'Get a specific block by system ID',
    inputSchema: {
      type: 'object',
      properties: {
        systemId: { type: 'string', description: 'The system ID of the block to retrieve' },
      },
      required: ['systemId'],
    },
  },
  {
    name: 'create_block',
    description: 'Create a new content block',
    inputSchema: {
      type: 'object',
      properties: {
        block: { type: 'object', description: 'Block data to create' },
      },
      required: ['block'],
    },
  },
  {
    name: 'update_block',
    description: 'Update an existing content block',
    inputSchema: {
      type: 'object',
      properties: {
        systemId: { type: 'string', description: 'The system ID of the block to update' },
        block: { type: 'object', description: 'Updated block data' },
      },
      required: ['systemId', 'block'],
    },
  },
  {
    name: 'delete_block',
    description: 'Delete a content block',
    inputSchema: {
      type: 'object',
      properties: {
        systemId: { type: 'string', description: 'The system ID of the block to delete' },
      },
      required: ['systemId'],
    },
  },
  {
    name: 'search_products',
    description: 'Search for products in Litium',
    inputSchema: {
      type: 'object',
      properties: {
        search: { type: 'string', description: 'Search term for filtering products' },
        skip: { type: 'number', description: 'Number of items to skip (for pagination)', default: 0 },
        take: { type: 'number', description: 'Number of items to return (for pagination)', default: 20 },
        sort: { type: 'string', description: 'Sort order for results' },
      },
    },
  },
  {
    name: 'get_product',
    description: 'Get a specific product by system ID',
    inputSchema: {
      type: 'object',
      properties: {
        systemId: { type: 'string', description: 'The system ID of the product to retrieve' },
      },
      required: ['systemId'],
    },
  },
  {
    name: 'create_product',
    description: 'Create a new product',
    inputSchema: {
      type: 'object',
      properties: {
        product: { type: 'object', description: 'Product data to create' },
      },
      required: ['product'],
    },
  },
  {
    name: 'update_product',
    description: 'Update an existing product',
    inputSchema: {
      type: 'object',
      properties: {
        systemId: { type: 'string', description: 'The system ID of the product to update' },
        product: { type: 'object', description: 'Updated product data' },
      },
      required: ['systemId', 'product'],
    },
  },
  {
    name: 'delete_product',
    description: 'Delete a product',
    inputSchema: {
      type: 'object',
      properties: {
        systemId: { type: 'string', description: 'The system ID of the product to delete' },
      },
      required: ['systemId'],
    },
  },
  {
    name: 'search_customers',
    description: 'Search for customers in Litium',
    inputSchema: {
      type: 'object',
      properties: {
        search: { type: 'string', description: 'Search term for filtering customers' },
        skip: { type: 'number', description: 'Number of items to skip (for pagination)', default: 0 },
        take: { type: 'number', description: 'Number of items to return (for pagination)', default: 20 },
        sort: { type: 'string', description: 'Sort order for results' },
      },
    },
  },
  {
    name: 'get_customer',
    description: 'Get a specific customer by system ID',
    inputSchema: {
      type: 'object',
      properties: {
        systemId: { type: 'string', description: 'The system ID of the customer to retrieve' },
      },
      required: ['systemId'],
    },
  },
  {
    name: 'create_customer',
    description: 'Create a new customer',
    inputSchema: {
      type: 'object',
      properties: {
        customer: { type: 'object', description: 'Customer data to create' },
      },
      required: ['customer'],
    },
  },
  {
    name: 'update_customer',
    description: 'Update an existing customer',
    inputSchema: {
      type: 'object',
      properties: {
        systemId: { type: 'string', description: 'The system ID of the customer to update' },
        customer: { type: 'object', description: 'Updated customer data' },
      },
      required: ['systemId', 'customer'],
    },
  },
  {
    name: 'delete_customer',
    description: 'Delete a customer',
    inputSchema: {
      type: 'object',
      properties: {
        systemId: { type: 'string', description: 'The system ID of the customer to delete' },
      },
      required: ['systemId'],
    },
  },
  {
    name: 'search_media',
    description: 'Search for media files in Litium',
    inputSchema: {
      type: 'object',
      properties: {
        search: { type: 'string', description: 'Search term for filtering media files' },
        skip: { type: 'number', description: 'Number of items to skip (for pagination)', default: 0 },
        take: { type: 'number', description: 'Number of items to return (for pagination)', default: 20 },
        sort: { type: 'string', description: 'Sort order for results' },
      },
    },
  },
  {
    name: 'get_media_file',
    description: 'Get a specific media file by system ID',
    inputSchema: {
      type: 'object',
      properties: {
        systemId: { type: 'string', description: 'The system ID of the media file to retrieve' },
      },
      required: ['systemId'],
    },
  },
  {
    name: 'get_websites',
    description: 'Get all websites',
    inputSchema: {
      type: 'object',
      properties: {},
    },
  },
  {
    name: 'get_website',
    description: 'Get a specific website by system ID',
    inputSchema: {
      type: 'object',
      properties: {
        systemId: { type: 'string', description: 'The system ID of the website to retrieve' },
      },
      required: ['systemId'],
    },
  },
  {
    name: 'search_orders',
    description: 'Search for orders in Litium',
    inputSchema: {
      type: 'object',
      properties: {
        search: { type: 'string', description: 'Search term for filtering orders' },
        skip: { type: 'number', description: 'Number of items to skip (for pagination)', default: 0 },
        take: { type: 'number', description: 'Number of items to return (for pagination)', default: 20 },
        sort: { type: 'string', description: 'Sort order for results' },
      },
    },
  },
  {
    name: 'get_order',
    description: 'Get a specific order by system ID',
    inputSchema: {
      type: 'object',
      properties: {
        systemId: { type: 'string', description: 'The system ID of the order to retrieve' },
      },
      required: ['systemId'],
    },
  },
];

// Tool execution handler
async function executeTool(toolName, args) {
  try {
    switch (toolName) {
      case 'configure_litium':
        initializeApiService(args);
        return { content: [{ type: 'text', text: 'Litium API configuration successful! You can now use other tools to interact with your Litium instance.' }] };

      default:
        if (!apiService) {
          return {
            content: [{ type: 'text', text: 'Error: Please configure Litium API credentials first using the configure_litium tool.' }],
            isError: true,
          };
        }
        break;
    }

    switch (toolName) {
      case 'search_blocks':
        const blocks = await apiService.blocks.searchBlocks(args);
        return { content: [{ type: 'text', text: JSON.stringify(blocks, null, 2) }] };

      case 'get_block':
        const block = await apiService.blocks.getBlock(args.systemId);
        return { content: [{ type: 'text', text: JSON.stringify(block, null, 2) }] };

      case 'create_block':
        const createdBlock = await apiService.blocks.createBlock(args.block);
        return { content: [{ type: 'text', text: JSON.stringify(createdBlock, null, 2) }] };

      case 'update_block':
        const updatedBlock = await apiService.blocks.updateBlock(args.systemId, args.block);
        return { content: [{ type: 'text', text: JSON.stringify(updatedBlock, null, 2) }] };

      case 'delete_block':
        await apiService.blocks.deleteBlock(args.systemId);
        return { content: [{ type: 'text', text: 'Block deleted successfully' }] };

      case 'search_products':
        const products = await apiService.products.searchBaseProducts(args);
        return { content: [{ type: 'text', text: JSON.stringify(products, null, 2) }] };

      case 'get_product':
        const product = await apiService.products.getBaseProduct(args.systemId);
        return { content: [{ type: 'text', text: JSON.stringify(product, null, 2) }] };

      case 'create_product':
        const createdProduct = await apiService.products.createBaseProduct(args.product);
        return { content: [{ type: 'text', text: JSON.stringify(createdProduct, null, 2) }] };

      case 'update_product':
        const updatedProduct = await apiService.products.updateBaseProduct(args.systemId, args.product);
        return { content: [{ type: 'text', text: JSON.stringify(updatedProduct, null, 2) }] };

      case 'delete_product':
        await apiService.products.deleteBaseProduct(args.systemId);
        return { content: [{ type: 'text', text: 'Product deleted successfully' }] };

      case 'search_customers':
        const customers = await apiService.customers.searchCustomers(args);
        return { content: [{ type: 'text', text: JSON.stringify(customers, null, 2) }] };

      case 'get_customer':
        const customer = await apiService.customers.getCustomer(args.systemId);
        return { content: [{ type: 'text', text: JSON.stringify(customer, null, 2) }] };

      case 'create_customer':
        const createdCustomer = await apiService.customers.createCustomer(args.customer);
        return { content: [{ type: 'text', text: JSON.stringify(createdCustomer, null, 2) }] };

      case 'update_customer':
        const updatedCustomer = await apiService.customers.updateCustomer(args.systemId, args.customer);
        return { content: [{ type: 'text', text: JSON.stringify(updatedCustomer, null, 2) }] };

      case 'delete_customer':
        await apiService.customers.deleteCustomer(args.systemId);
        return { content: [{ type: 'text', text: 'Customer deleted successfully' }] };

      case 'search_media':
        const mediaFiles = await apiService.media.searchMediaFiles(args);
        return { content: [{ type: 'text', text: JSON.stringify(mediaFiles, null, 2) }] };

      case 'get_media_file':
        const mediaFile = await apiService.media.getMediaFile(args.systemId);
        return { content: [{ type: 'text', text: JSON.stringify(mediaFile, null, 2) }] };

      case 'get_websites':
        const websites = await apiService.websites.getWebsites();
        return { content: [{ type: 'text', text: JSON.stringify(websites, null, 2) }] };

      case 'get_website':
        const website = await apiService.websites.getWebsite(args.systemId);
        return { content: [{ type: 'text', text: JSON.stringify(website, null, 2) }] };

      case 'search_orders':
        const orders = await apiService.orders.searchSalesOrders(args);
        return { content: [{ type: 'text', text: JSON.stringify(orders, null, 2) }] };

      case 'get_order':
        const order = await apiService.orders.getSalesOrder(args.systemId);
        return { content: [{ type: 'text', text: JSON.stringify(order, null, 2) }] };

      default:
        throw new Error(`Unknown tool: ${toolName}`);
    }
  } catch (error) {
    const apiError = handleError(error);
    const errorMessage = formatErrorForMCP(apiError);
    
    logger.error(`Tool execution failed for ${toolName}:`, apiError);
    
    return {
      content: [{ type: 'text', text: `Error: ${errorMessage}` }],
      isError: true,
    };
  }
}

export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  try {
    if (req.method === 'GET') {
      // Return server info and available tools
      res.status(200).json({
        name: 'Litium Admin MCP Server',
        version: '1.0.0',
        status: 'running',
        message: 'MCP server is running on Vercel',
        tools: tools.map(tool => ({
          name: tool.name,
          description: tool.description,
          inputSchema: tool.inputSchema
        }))
      });
    } else if (req.method === 'POST') {
      const { action, tool, arguments: args } = req.body;

      if (action === 'list_tools') {
        res.status(200).json({ tools });
      } else if (action === 'call_tool') {
        if (!tool) {
          res.status(400).json({ error: 'Tool name is required' });
          return;
        }

        const result = await executeTool(tool, args || {});
        res.status(200).json(result);
      } else {
        res.status(400).json({ error: 'Invalid action. Use "list_tools" or "call_tool"' });
      }
    } else {
      res.status(405).json({ error: 'Method not allowed' });
    }
  } catch (error) {
    const apiError = handleError(error);
    logger.error('Request failed:', apiError);
    
    res.status(500).json({
      error: 'Internal Server Error',
      message: apiError.message
    });
  }
}