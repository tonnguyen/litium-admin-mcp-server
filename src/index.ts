#!/usr/bin/env node

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  type CallToolResult,
  type ListToolsResult,
  type Tool,
} from '@modelcontextprotocol/sdk/types.js';
import { createLitiumConfig, createMCPConfig } from './utils/config.js';
import { LitiumApiService } from './services/litium-api.js';
import { logger } from './utils/logger.js';
import { handleError, formatErrorForMCP } from './utils/error-handler.js';
import { z } from 'zod';

// MCP server configuration
const mcpConfig = createMCPConfig();
let apiService: LitiumApiService | null = null;

const server = new Server(
  {
    name: mcpConfig.serverName,
    version: mcpConfig.serverVersion,
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

// Define available tools
const tools: Tool[] = [
  {
    name: 'configure_litium',
    description: 'Configure Litium API credentials for the MCP server',
    inputSchema: {
      type: 'object',
      properties: {
        baseUrl: {
          type: 'string',
          description: 'Litium instance base URL (e.g., https://demoadmin.litium.com)',
        },
        clientId: {
          type: 'string',
          description: 'OAuth2 client ID for Litium API access',
        },
        clientSecret: {
          type: 'string',
          description: 'OAuth2 client secret for Litium API access',
        },
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
        search: {
          type: 'string',
          description: 'Search term for filtering blocks',
        },
        skip: {
          type: 'number',
          description: 'Number of items to skip (for pagination)',
          default: 0,
        },
        take: {
          type: 'number',
          description: 'Number of items to return (for pagination)',
          default: 20,
        },
        sort: {
          type: 'string',
          description: 'Sort order for results',
        },
      },
    },
  },
  {
    name: 'get_block',
    description: 'Get a specific block by system ID',
    inputSchema: {
      type: 'object',
      properties: {
        systemId: {
          type: 'string',
          description: 'The system ID of the block to retrieve',
        },
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
        block: {
          type: 'object',
          description: 'Block data to create',
        },
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
        systemId: {
          type: 'string',
          description: 'The system ID of the block to update',
        },
        block: {
          type: 'object',
          description: 'Updated block data',
        },
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
        systemId: {
          type: 'string',
          description: 'The system ID of the block to delete',
        },
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
        search: {
          type: 'string',
          description: 'Search term for filtering products',
        },
        skip: {
          type: 'number',
          description: 'Number of items to skip (for pagination)',
          default: 0,
        },
        take: {
          type: 'number',
          description: 'Number of items to return (for pagination)',
          default: 20,
        },
        sort: {
          type: 'string',
          description: 'Sort order for results',
        },
      },
    },
  },
  {
    name: 'get_product',
    description: 'Get a specific product by system ID',
    inputSchema: {
      type: 'object',
      properties: {
        systemId: {
          type: 'string',
          description: 'The system ID of the product to retrieve',
        },
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
        product: {
          type: 'object',
          description: 'Product data to create',
        },
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
        systemId: {
          type: 'string',
          description: 'The system ID of the product to update',
        },
        product: {
          type: 'object',
          description: 'Updated product data',
        },
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
        systemId: {
          type: 'string',
          description: 'The system ID of the product to delete',
        },
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
        search: {
          type: 'string',
          description: 'Search term for filtering customers',
        },
        skip: {
          type: 'number',
          description: 'Number of items to skip (for pagination)',
          default: 0,
        },
        take: {
          type: 'number',
          description: 'Number of items to return (for pagination)',
          default: 20,
        },
        sort: {
          type: 'string',
          description: 'Sort order for results',
        },
      },
    },
  },
  {
    name: 'get_customer',
    description: 'Get a specific customer by system ID',
    inputSchema: {
      type: 'object',
      properties: {
        systemId: {
          type: 'string',
          description: 'The system ID of the customer to retrieve',
        },
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
        customer: {
          type: 'object',
          description: 'Customer data to create',
        },
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
        systemId: {
          type: 'string',
          description: 'The system ID of the customer to update',
        },
        customer: {
          type: 'object',
          description: 'Updated customer data',
        },
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
        systemId: {
          type: 'string',
          description: 'The system ID of the customer to delete',
        },
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
        search: {
          type: 'string',
          description: 'Search term for filtering media files',
        },
        skip: {
          type: 'number',
          description: 'Number of items to skip (for pagination)',
          default: 0,
        },
        take: {
          type: 'number',
          description: 'Number of items to return (for pagination)',
          default: 20,
        },
        sort: {
          type: 'string',
          description: 'Sort order for results',
        },
      },
    },
  },
  {
    name: 'get_media_file',
    description: 'Get a specific media file by system ID',
    inputSchema: {
      type: 'object',
      properties: {
        systemId: {
          type: 'string',
          description: 'The system ID of the media file to retrieve',
        },
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
        systemId: {
          type: 'string',
          description: 'The system ID of the website to retrieve',
        },
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
        search: {
          type: 'string',
          description: 'Search term for filtering orders',
        },
        skip: {
          type: 'number',
          description: 'Number of items to skip (for pagination)',
          default: 0,
        },
        take: {
          type: 'number',
          description: 'Number of items to return (for pagination)',
          default: 20,
        },
        sort: {
          type: 'string',
          description: 'Sort order for results',
        },
      },
    },
  },
  {
    name: 'get_order',
    description: 'Get a specific order by system ID',
    inputSchema: {
      type: 'object',
      properties: {
        systemId: {
          type: 'string',
          description: 'The system ID of the order to retrieve',
        },
      },
      required: ['systemId'],
    },
  },
];

// List tools handler
server.setRequestHandler(ListToolsRequestSchema, async (): Promise<ListToolsResult> => {
  return {
    tools,
  };
});

// Call tool handler
server.setRequestHandler(CallToolRequestSchema, async (request): Promise<CallToolResult> => {
  const { name, arguments: args } = request.params;

  try {
    switch (name) {
      case 'configure_litium':
        const litiumConfig = createLitiumConfig(args as {
          baseUrl: string;
          clientId: string;
          clientSecret: string;
        });
        apiService = new LitiumApiService(litiumConfig);
        return {
          content: [
            {
              type: 'text',
              text: 'Litium API configuration successful! You can now use other tools to interact with your Litium instance.',
            },
          ],
        };

      default:
        if (!apiService) {
          return {
            content: [
              {
                type: 'text',
                text: 'Error: Please configure Litium API credentials first using the configure_litium tool.',
              },
            ],
            isError: true,
          };
        }
        break;
    }

    switch (name) {
      case 'search_blocks':
        const blockSearchParams = args as {
          search?: string;
          skip?: number;
          take?: number;
          sort?: string;
        };
        const blocks = await apiService!.blocks.searchBlocks(blockSearchParams);
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(blocks, null, 2),
            },
          ],
        };

      case 'get_block':
        const blockId = (args as { systemId: string }).systemId;
        const block = await apiService!.blocks.getBlock(blockId);
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(block, null, 2),
            },
          ],
        };

      case 'create_block':
        const blockData = (args as { block: any }).block;
        const createdBlock = await apiService!.blocks.createBlock(blockData);
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(createdBlock, null, 2),
            },
          ],
        };

      case 'update_block':
        const { systemId: blockSystemId, block: updatedBlockData } = args as {
          systemId: string;
          block: any;
        };
        const updatedBlock = await apiService!.blocks.updateBlock(blockSystemId, updatedBlockData);
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(updatedBlock, null, 2),
            },
          ],
        };

      case 'delete_block':
        const blockDeleteId = (args as { systemId: string }).systemId;
        await apiService!.blocks.deleteBlock(blockDeleteId);
        return {
          content: [
            {
              type: 'text',
              text: 'Block deleted successfully',
            },
          ],
        };

      case 'search_products':
        const productSearchParams = args as {
          search?: string;
          skip?: number;
          take?: number;
          sort?: string;
        };
        const products = await apiService!.products.searchBaseProducts(productSearchParams);
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(products, null, 2),
            },
          ],
        };

      case 'get_product':
        const productId = (args as { systemId: string }).systemId;
        const product = await apiService!.products.getBaseProduct(productId);
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(product, null, 2),
            },
          ],
        };

      case 'create_product':
        const productData = (args as { product: any }).product;
        const createdProduct = await apiService!.products.createBaseProduct(productData);
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(createdProduct, null, 2),
            },
          ],
        };

      case 'update_product':
        const { systemId: productSystemId, product: updatedProductData } = args as {
          systemId: string;
          product: any;
        };
        const updatedProduct = await apiService!.products.updateBaseProduct(productSystemId, updatedProductData);
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(updatedProduct, null, 2),
            },
          ],
        };

      case 'delete_product':
        const productDeleteId = (args as { systemId: string }).systemId;
        await apiService!.products.deleteBaseProduct(productDeleteId);
        return {
          content: [
            {
              type: 'text',
              text: 'Product deleted successfully',
            },
          ],
        };

      case 'search_customers':
        const customerSearchParams = args as {
          search?: string;
          skip?: number;
          take?: number;
          sort?: string;
        };
        const customers = await apiService!.customers.searchCustomers(customerSearchParams);
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(customers, null, 2),
            },
          ],
        };

      case 'get_customer':
        const customerId = (args as { systemId: string }).systemId;
        const customer = await apiService!.customers.getCustomer(customerId);
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(customer, null, 2),
            },
          ],
        };

      case 'create_customer':
        const customerData = (args as { customer: any }).customer;
        const createdCustomer = await apiService!.customers.createCustomer(customerData);
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(createdCustomer, null, 2),
            },
          ],
        };

      case 'update_customer':
        const { systemId: customerSystemId, customer: updatedCustomerData } = args as {
          systemId: string;
          customer: any;
        };
        const updatedCustomer = await apiService!.customers.updateCustomer(customerSystemId, updatedCustomerData);
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(updatedCustomer, null, 2),
            },
          ],
        };

      case 'delete_customer':
        const customerDeleteId = (args as { systemId: string }).systemId;
        await apiService!.customers.deleteCustomer(customerDeleteId);
        return {
          content: [
            {
              type: 'text',
              text: 'Customer deleted successfully',
            },
          ],
        };

      case 'search_media':
        const mediaSearchParams = args as {
          search?: string;
          skip?: number;
          take?: number;
          sort?: string;
        };
        const mediaFiles = await apiService!.media.searchMediaFiles(mediaSearchParams);
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(mediaFiles, null, 2),
            },
          ],
        };

      case 'get_media_file':
        const mediaId = (args as { systemId: string }).systemId;
        const mediaFile = await apiService!.media.getMediaFile(mediaId);
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(mediaFile, null, 2),
            },
          ],
        };

      case 'get_websites':
        const websites = await apiService!.websites.getWebsites();
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(websites, null, 2),
            },
          ],
        };

      case 'get_website':
        const websiteId = (args as { systemId: string }).systemId;
        const website = await apiService!.websites.getWebsite(websiteId);
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(website, null, 2),
            },
          ],
        };

      case 'search_orders':
        const orderSearchParams = args as {
          search?: string;
          skip?: number;
          take?: number;
          sort?: string;
        };
        const orders = await apiService!.orders.searchSalesOrders(orderSearchParams);
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(orders, null, 2),
            },
          ],
        };

      case 'get_order':
        const orderId = (args as { systemId: string }).systemId;
        const order = await apiService!.orders.getSalesOrder(orderId);
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(order, null, 2),
            },
          ],
        };

      default:
        throw new Error(`Unknown tool: ${name}`);
    }
  } catch (error) {
    const apiError = handleError(error);
    const errorMessage = formatErrorForMCP(apiError);
    
    logger.error(`Tool execution failed for ${name}:`, apiError);
    
    return {
      content: [
        {
          type: 'text',
          text: `Error: ${errorMessage}`,
        },
      ],
      isError: true,
    };
  }
});

// Start the server
async function main() {
  try {
    const transport = new StdioServerTransport();
    await server.connect(transport);
    logger.info('🚀 Litium Admin MCP Server started successfully');
  } catch (error) {
    const apiError = handleError(error);
    logger.error('❌ Failed to start server:', apiError);
    process.exit(1);
  }
}

main().catch((error) => {
  const apiError = handleError(error);
  logger.error('❌ Fatal error:', apiError);
  process.exit(1);
});