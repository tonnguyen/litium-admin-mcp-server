import { createMcpHandler } from 'mcp-handler';
import { z } from 'zod';
import { LitiumApiService } from '../../../src/services/litium-api';
import { createLitiumConfig } from '../../../src/utils/config';
import { handleError, formatErrorForMCP } from '../../../src/utils/error-handler';
import { logger } from '../../../src/utils/logger';

// Helper function to extract Litium credentials from request headers
function getLitiumConfigFromHeaders(request: Request): { baseUrl: string; clientId: string; clientSecret: string } | null {
  const baseUrl = request.headers.get('X-Litium-Base-Url');
  const clientId = request.headers.get('X-Litium-Client-Id');
  const clientSecret = request.headers.get('X-Litium-Client-Secret');

  if (!baseUrl || !clientId || !clientSecret) {
    return null;
  }

  return { baseUrl, clientId, clientSecret };
}

// Helper function to get API service instance from request
function getApiService(request: Request): LitiumApiService {
  const credentials = getLitiumConfigFromHeaders(request);
  
  if (!credentials) {
    throw new Error('Missing Litium credentials. Please configure X-Litium-Base-Url, X-Litium-Client-Id, and X-Litium-Client-Secret headers in your MCP client configuration.');
  }

  try {
    const config = createLitiumConfig(credentials);
    return new LitiumApiService(config);
  } catch (error) {
    const apiError = handleError(error);
    logger.error('Failed to initialize Litium API service:', apiError);
    throw new Error(`Configuration failed: ${formatErrorForMCP(apiError)}`);
  }
}

// Create MCP handler using Next.js request
const handler = async (req: Request) => {
  return createMcpHandler(
    (server) => {
      // Block tools
      server.tool(
        'search_blocks',
        'Search for content blocks in Litium',
        {
          search: z.string().optional().describe('Search term for filtering blocks'),
          skip: z.number().optional().default(0).describe('Number of items to skip (for pagination)'),
          take: z.number().optional().default(20).describe('Number of items to return (for pagination)'),
          sort: z.string().optional().describe('Sort order for results'),
        },
        async (params) => {
          try {
            // Get API service from request (req from outer scope)
            const apiService = getApiService(req);
            const blocks = await apiService.blocks.searchBlocks(params);
            return {
              content: [{ type: 'text', text: JSON.stringify(blocks, null, 2) }],
            };
          } catch (error) {
            const apiError = handleError(error);
            logger.error('Search blocks failed:', apiError);
            throw new Error(formatErrorForMCP(apiError));
          }
        }
      );

    server.tool(
      'get_block',
      'Get a specific block by system ID',
      {
        systemId: z.string().describe('The system ID of the block to retrieve'),
      },
      async ({ systemId }) => {
        try {
          const apiService = getApiService(req);
          const block = await apiService.blocks.getBlock(systemId);
          return {
            content: [{ type: 'text', text: JSON.stringify(block, null, 2) }],
          };
        } catch (error) {
          const apiError = handleError(error);
          logger.error('Get block failed:', apiError);
          throw new Error(formatErrorForMCP(apiError));
        }
      }
    );

    server.tool(
      'create_block',
      'Create a new content block',
      {
        block: z.any().describe('Block data to create'),
      },
      async ({ block }) => {
        try {
          const apiService = getApiService(req);
          const createdBlock = await apiService.blocks.createBlock(block);
          return {
            content: [{ type: 'text', text: JSON.stringify(createdBlock, null, 2) }],
          };
        } catch (error) {
          const apiError = handleError(error);
          logger.error('Create block failed:', apiError);
          throw new Error(formatErrorForMCP(apiError));
        }
      }
    );

    server.tool(
      'update_block',
      'Update an existing content block',
      {
        systemId: z.string().describe('The system ID of the block to update'),
        block: z.any().describe('Updated block data'),
      },
      async ({ systemId, block }) => {
        try {
          const apiService = getApiService(req);
          const updatedBlock = await apiService.blocks.updateBlock(systemId, block);
          return {
            content: [{ type: 'text', text: JSON.stringify(updatedBlock, null, 2) }],
          };
        } catch (error) {
          const apiError = handleError(error);
          logger.error('Update block failed:', apiError);
          throw new Error(formatErrorForMCP(apiError));
        }
      }
    );

    server.tool(
      'delete_block',
      'Delete a content block',
      {
        systemId: z.string().describe('The system ID of the block to delete'),
      },
      async ({ systemId }) => {
        try {
          const apiService = getApiService(req);
          await apiService.blocks.deleteBlock(systemId);
          return {
            content: [{ type: 'text', text: 'Block deleted successfully' }],
          };
        } catch (error) {
          const apiError = handleError(error);
          logger.error('Delete block failed:', apiError);
          throw new Error(formatErrorForMCP(apiError));
        }
      }
    );

    // Product tools
    server.tool(
      'search_products',
      'Search for products in Litium',
      {
        search: z.string().optional().describe('Search term for filtering products'),
        skip: z.number().optional().default(0).describe('Number of items to skip (for pagination)'),
        take: z.number().optional().default(20).describe('Number of items to return (for pagination)'),
        sort: z.string().optional().describe('Sort order for results'),
      },
      async (params) => {
        try {
          const apiService = getApiService(req);
          const products = await apiService.products.searchBaseProducts(params);
          return {
            content: [{ type: 'text', text: JSON.stringify(products, null, 2) }],
          };
        } catch (error) {
          const apiError = handleError(error);
          logger.error('Search products failed:', apiError);
          throw new Error(formatErrorForMCP(apiError));
        }
      }
    );

    server.tool(
      'get_product',
      'Get a specific product by system ID',
      {
        systemId: z.string().describe('The system ID of the product to retrieve'),
      },
      async ({ systemId }) => {
        try {
          const apiService = getApiService(req);
          const product = await apiService.products.getBaseProduct(systemId);
          return {
            content: [{ type: 'text', text: JSON.stringify(product, null, 2) }],
          };
        } catch (error) {
          const apiError = handleError(error);
          logger.error('Get product failed:', apiError);
          throw new Error(formatErrorForMCP(apiError));
        }
      }
    );

    server.tool(
      'create_product',
      'Create a new product',
      {
        product: z.any().describe('Product data to create'),
      },
      async ({ product }) => {
        try {
          const apiService = getApiService(req);
          const createdProduct = await apiService.products.createBaseProduct(product);
          return {
            content: [{ type: 'text', text: JSON.stringify(createdProduct, null, 2) }],
          };
        } catch (error) {
          const apiError = handleError(error);
          logger.error('Create product failed:', apiError);
          throw new Error(formatErrorForMCP(apiError));
        }
      }
    );

    server.tool(
      'update_product',
      'Update an existing product',
      {
        systemId: z.string().describe('The system ID of the product to update'),
        product: z.any().describe('Updated product data'),
      },
      async ({ systemId, product }) => {
        try {
          const apiService = getApiService(req);
          const updatedProduct = await apiService.products.updateBaseProduct(systemId, product);
          return {
            content: [{ type: 'text', text: JSON.stringify(updatedProduct, null, 2) }],
          };
        } catch (error) {
          const apiError = handleError(error);
          logger.error('Update product failed:', apiError);
          throw new Error(formatErrorForMCP(apiError));
        }
      }
    );

    server.tool(
      'delete_product',
      'Delete a product',
      {
        systemId: z.string().describe('The system ID of the product to delete'),
      },
      async ({ systemId }) => {
        try {
          const apiService = getApiService(req);
          await apiService.products.deleteBaseProduct(systemId);
          return {
            content: [{ type: 'text', text: 'Product deleted successfully' }],
          };
        } catch (error) {
          const apiError = handleError(error);
          logger.error('Delete product failed:', apiError);
          throw new Error(formatErrorForMCP(apiError));
        }
      }
    );

    // Customer tools
    server.tool(
      'search_customers',
      'Search for customers in Litium',
      {
        search: z.string().optional().describe('Search term for filtering customers'),
        skip: z.number().optional().default(0).describe('Number of items to skip (for pagination)'),
        take: z.number().optional().default(20).describe('Number of items to return (for pagination)'),
        sort: z.string().optional().describe('Sort order for results'),
      },
      async (params) => {
        try {
          const apiService = getApiService(req);
          const customers = await apiService.customers.searchCustomers(params);
          return {
            content: [{ type: 'text', text: JSON.stringify(customers, null, 2) }],
          };
        } catch (error) {
          const apiError = handleError(error);
          logger.error('Search customers failed:', apiError);
          throw new Error(formatErrorForMCP(apiError));
        }
      }
    );

    server.tool(
      'get_customer',
      'Get a specific customer by system ID',
      {
        systemId: z.string().describe('The system ID of the customer to retrieve'),
      },
      async ({ systemId }) => {
        try {
          const apiService = getApiService(req);
          const customer = await apiService.customers.getCustomer(systemId);
          return {
            content: [{ type: 'text', text: JSON.stringify(customer, null, 2) }],
          };
        } catch (error) {
          const apiError = handleError(error);
          logger.error('Get customer failed:', apiError);
          throw new Error(formatErrorForMCP(apiError));
        }
      }
    );

    server.tool(
      'create_customer',
      'Create a new customer',
      {
        customer: z.any().describe('Customer data to create'),
      },
      async ({ customer }) => {
        try {
          const apiService = getApiService(req);
          const createdCustomer = await apiService.customers.createCustomer(customer);
          return {
            content: [{ type: 'text', text: JSON.stringify(createdCustomer, null, 2) }],
          };
        } catch (error) {
          const apiError = handleError(error);
          logger.error('Create customer failed:', apiError);
          throw new Error(formatErrorForMCP(apiError));
        }
      }
    );

    server.tool(
      'update_customer',
      'Update an existing customer',
      {
        systemId: z.string().describe('The system ID of the customer to update'),
        customer: z.any().describe('Updated customer data'),
      },
      async ({ systemId, customer }) => {
        try {
          const apiService = getApiService(req);
          const updatedCustomer = await apiService.customers.updateCustomer(systemId, customer);
          return {
            content: [{ type: 'text', text: JSON.stringify(updatedCustomer, null, 2) }],
          };
        } catch (error) {
          const apiError = handleError(error);
          logger.error('Update customer failed:', apiError);
          throw new Error(formatErrorForMCP(apiError));
        }
      }
    );

    server.tool(
      'delete_customer',
      'Delete a customer',
      {
        systemId: z.string().describe('The system ID of the customer to delete'),
      },
      async ({ systemId }) => {
        try {
          const apiService = getApiService(req);
          await apiService.customers.deleteCustomer(systemId);
          return {
            content: [{ type: 'text', text: 'Customer deleted successfully' }],
          };
        } catch (error) {
          const apiError = handleError(error);
          logger.error('Delete customer failed:', apiError);
          throw new Error(formatErrorForMCP(apiError));
        }
      }
    );

    // Media tools
    server.tool(
      'search_media',
      'Search for media files in Litium',
      {
        search: z.string().optional().describe('Search term for filtering media'),
        skip: z.number().optional().default(0).describe('Number of items to skip (for pagination)'),
        take: z.number().optional().default(20).describe('Number of items to return (for pagination)'),
        sort: z.string().optional().describe('Sort order for results'),
      },
      async (params) => {
        try {
          const apiService = getApiService(req);
          const media = await apiService.media.searchMediaFiles(params);
          return {
            content: [{ type: 'text', text: JSON.stringify(media, null, 2) }],
          };
        } catch (error) {
          const apiError = handleError(error);
          logger.error('Search media failed:', apiError);
          throw new Error(formatErrorForMCP(apiError));
        }
      }
    );

    server.tool(
      'get_media',
      'Get a specific media file by system ID',
      {
        systemId: z.string().describe('The system ID of the media file to retrieve'),
      },
      async ({ systemId }) => {
        try {
          const apiService = getApiService(req);
          const media = await apiService.media.getMediaFile(systemId);
          return {
            content: [{ type: 'text', text: JSON.stringify(media, null, 2) }],
          };
        } catch (error) {
          const apiError = handleError(error);
          logger.error('Get media failed:', apiError);
          throw new Error(formatErrorForMCP(apiError));
        }
      }
    );

    // Website tools
    server.tool(
      'get_websites',
      'Get all websites',
      {},
      async () => {
        try {
          const apiService = getApiService(req);
          const websites = await apiService.websites.getWebsites();
          return {
            content: [{ type: 'text', text: JSON.stringify(websites, null, 2) }],
          };
        } catch (error) {
          const apiError = handleError(error);
          logger.error('Get websites failed:', apiError);
          throw new Error(formatErrorForMCP(apiError));
        }
      }
    );

    server.tool(
      'get_website',
      'Get a specific website by system ID',
      {
        systemId: z.string().describe('The system ID of the website to retrieve'),
      },
      async ({ systemId }) => {
        try {
          const apiService = getApiService(req);
          const website = await apiService.websites.getWebsite(systemId);
          return {
            content: [{ type: 'text', text: JSON.stringify(website, null, 2) }],
          };
        } catch (error) {
          const apiError = handleError(error);
          logger.error('Get website failed:', apiError);
          throw new Error(formatErrorForMCP(apiError));
        }
      }
    );

    // Order tools
    server.tool(
      'search_orders',
      'Search for sales orders in Litium',
      {
        search: z.string().optional().describe('Search term for filtering orders'),
        skip: z.number().optional().default(0).describe('Number of items to skip (for pagination)'),
        take: z.number().optional().default(20).describe('Number of items to return (for pagination)'),
        sort: z.string().optional().describe('Sort order for results'),
      },
      async (params) => {
        try {
          const apiService = getApiService(req);
          const orders = await apiService.orders.searchSalesOrders(params);
          return {
            content: [{ type: 'text', text: JSON.stringify(orders, null, 2) }],
          };
        } catch (error) {
          const apiError = handleError(error);
          logger.error('Search orders failed:', apiError);
          throw new Error(formatErrorForMCP(apiError));
        }
      }
    );

    server.tool(
      'get_order',
      'Get a specific order by system ID',
      {
        systemId: z.string().describe('The system ID of the order to retrieve'),
      },
      async ({ systemId }) => {
        try {
          const apiService = getApiService(req);
          const order = await apiService.orders.getSalesOrder(systemId);
          return {
            content: [{ type: 'text', text: JSON.stringify(order, null, 2) }],
          };
        } catch (error) {
          const apiError = handleError(error);
          logger.error('Get order failed:', apiError);
          throw new Error(formatErrorForMCP(apiError));
        }
      }
    );
    },
    {
      serverInfo: {
        name: 'Litium Admin MCP Server',
        version: '1.0.0',
      },
    },
    {
      basePath: '/api',
      verboseLogs: true,
      maxDuration: 60,
    }
  )(req);
};

export { handler as GET, handler as POST, handler as DELETE };

