// Vercel serverless function wrapper for MCP server
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { loadConfig, validateConfig } from '../src/utils/config.js';
import { LitiumApiService } from '../src/services/litium-api.js';
import { logger } from '../src/utils/logger.js';
import { handleError, formatErrorForMCP } from '../src/utils/error-handler.js';

// Initialize server components
let server;
let apiService;

async function initializeServer() {
  if (server && apiService) {
    return { server, apiService };
  }

  try {
    // Validate configuration
    validateConfig();
    const config = loadConfig();
    apiService = new LitiumApiService(config);

    // Create MCP server
    server = new Server(
      {
        name: config.serverName,
        version: config.serverVersion,
      },
      {
        capabilities: {
          tools: {},
        },
      }
    );

    // Define available tools (same as in main index.ts)
    const tools = [
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

    // Set up tool handlers
    server.setRequestHandler({ method: 'tools/list' }, async () => ({ tools }));

    server.setRequestHandler({ method: 'tools/call' }, async (request) => {
      const { name, arguments: args } = request.params;

      try {
        switch (name) {
          case 'search_blocks':
            const blockSearchParams = args;
            const blocks = await apiService.getBlocks(blockSearchParams);
            return {
              content: [{ type: 'text', text: JSON.stringify(blocks, null, 2) }],
            };

          case 'get_block':
            const blockId = args.systemId;
            const block = await apiService.getBlock(blockId);
            return {
              content: [{ type: 'text', text: JSON.stringify(block, null, 2) }],
            };

          case 'create_block':
            const blockData = args.block;
            const createdBlock = await apiService.createBlock(blockData);
            return {
              content: [{ type: 'text', text: JSON.stringify(createdBlock, null, 2) }],
            };

          case 'update_block':
            const { systemId: blockSystemId, block: updatedBlockData } = args;
            const updatedBlock = await apiService.updateBlock(blockSystemId, updatedBlockData);
            return {
              content: [{ type: 'text', text: JSON.stringify(updatedBlock, null, 2) }],
            };

          case 'delete_block':
            const blockDeleteId = args.systemId;
            await apiService.deleteBlock(blockDeleteId);
            return {
              content: [{ type: 'text', text: 'Block deleted successfully' }],
            };

          case 'search_products':
            const productSearchParams = args;
            const products = await apiService.getBaseProducts(productSearchParams);
            return {
              content: [{ type: 'text', text: JSON.stringify(products, null, 2) }],
            };

          case 'get_product':
            const productId = args.systemId;
            const product = await apiService.getBaseProduct(productId);
            return {
              content: [{ type: 'text', text: JSON.stringify(product, null, 2) }],
            };

          case 'create_product':
            const productData = args.product;
            const createdProduct = await apiService.createBaseProduct(productData);
            return {
              content: [{ type: 'text', text: JSON.stringify(createdProduct, null, 2) }],
            };

          case 'update_product':
            const { systemId: productSystemId, product: updatedProductData } = args;
            const updatedProduct = await apiService.updateBaseProduct(productSystemId, updatedProductData);
            return {
              content: [{ type: 'text', text: JSON.stringify(updatedProduct, null, 2) }],
            };

          case 'delete_product':
            const productDeleteId = args.systemId;
            await apiService.deleteBaseProduct(productDeleteId);
            return {
              content: [{ type: 'text', text: 'Product deleted successfully' }],
            };

          case 'search_customers':
            const customerSearchParams = args;
            const customers = await apiService.getCustomers(customerSearchParams);
            return {
              content: [{ type: 'text', text: JSON.stringify(customers, null, 2) }],
            };

          case 'get_customer':
            const customerId = args.systemId;
            const customer = await apiService.getCustomer(customerId);
            return {
              content: [{ type: 'text', text: JSON.stringify(customer, null, 2) }],
            };

          case 'create_customer':
            const customerData = args.customer;
            const createdCustomer = await apiService.createCustomer(customerData);
            return {
              content: [{ type: 'text', text: JSON.stringify(createdCustomer, null, 2) }],
            };

          case 'update_customer':
            const { systemId: customerSystemId, customer: updatedCustomerData } = args;
            const updatedCustomer = await apiService.updateCustomer(customerSystemId, updatedCustomerData);
            return {
              content: [{ type: 'text', text: JSON.stringify(updatedCustomer, null, 2) }],
            };

          case 'delete_customer':
            const customerDeleteId = args.systemId;
            await apiService.deleteCustomer(customerDeleteId);
            return {
              content: [{ type: 'text', text: 'Customer deleted successfully' }],
            };

          case 'search_media':
            const mediaSearchParams = args;
            const mediaFiles = await apiService.getMediaFiles(mediaSearchParams);
            return {
              content: [{ type: 'text', text: JSON.stringify(mediaFiles, null, 2) }],
            };

          case 'get_media_file':
            const mediaId = args.systemId;
            const mediaFile = await apiService.getMediaFile(mediaId);
            return {
              content: [{ type: 'text', text: JSON.stringify(mediaFile, null, 2) }],
            };

          case 'get_websites':
            const websites = await apiService.getWebsites();
            return {
              content: [{ type: 'text', text: JSON.stringify(websites, null, 2) }],
            };

          case 'get_website':
            const websiteId = args.systemId;
            const website = await apiService.getWebsite(websiteId);
            return {
              content: [{ type: 'text', text: JSON.stringify(website, null, 2) }],
            };

          case 'search_orders':
            const orderSearchParams = args;
            const orders = await apiService.getSalesOrders(orderSearchParams);
            return {
              content: [{ type: 'text', text: JSON.stringify(orders, null, 2) }],
            };

          case 'get_order':
            const orderId = args.systemId;
            const order = await apiService.getSalesOrder(orderId);
            return {
              content: [{ type: 'text', text: JSON.stringify(order, null, 2) }],
            };

          default:
            throw new Error(`Unknown tool: ${name}`);
        }
      } catch (error) {
        const apiError = handleError(error);
        const errorMessage = formatErrorForMCP(apiError);
        
        logger.error(`Tool execution failed for ${name}:`, apiError);
        
        return {
          content: [{ type: 'text', text: `Error: ${errorMessage}` }],
          isError: true,
        };
      }
    });

    return { server, apiService };
  } catch (error) {
    const apiError = handleError(error);
    logger.error('Failed to initialize server:', apiError);
    throw apiError;
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
    const { server } = await initializeServer();
    
    // Handle MCP requests
    if (req.method === 'POST') {
      const body = req.body;
      
      // Process MCP request
      const response = await server.handleRequest(body);
      
      res.status(200).json(response);
    } else {
      // Return server info for GET requests
      res.status(200).json({
        name: 'Litium Admin MCP Server',
        version: '1.0.0',
        status: 'running',
        message: 'MCP server is running on Vercel'
      });
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