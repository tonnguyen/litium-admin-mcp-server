import { BaseApiService } from '../base-api';
import { type LitiumConfig } from '../../types/config';

export interface ApiEndpoint {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  path: string;
  description: string;
  parameters?: Array<{
    name: string;
    type: string;
    required: boolean;
    description: string;
  }>;
  example?: string;
  category: string;
}

export class ApiDiscoveryService extends BaseApiService {
  constructor(config: LitiumConfig) {
    super(config);
  }

  /**
   * Get comprehensive list of all known Litium API endpoints
   */
  async getAllEndpoints(): Promise<ApiEndpoint[]> {
    return [
      // OAuth/Authentication endpoints
      {
        method: 'POST',
        path: '/Litium/OAuth/token',
        description: 'OAuth2 token endpoint for authentication',
        parameters: [
          { name: 'grant_type', type: 'string', required: true, description: 'Must be "client_credentials"' },
          { name: 'client_id', type: 'string', required: true, description: 'OAuth2 client ID' },
          { name: 'client_secret', type: 'string', required: true, description: 'OAuth2 client secret' }
        ],
        example: 'POST /Litium/OAuth/token with form data: grant_type=client_credentials&client_id=xxx&client_secret=xxx',
        category: 'Authentication'
      },

      // Products endpoints
      {
        method: 'POST',
        path: '/Litium/api/admin/products/baseProducts/search',
        description: 'Search for base products',
        parameters: [
          { name: 'search', type: 'string', required: false, description: 'Search term' },
          { name: 'skip', type: 'number', required: false, description: 'Pagination offset' },
          { name: 'take', type: 'number', required: false, description: 'Number of items to return' },
          { name: 'sort', type: 'string', required: false, description: 'Sort order' }
        ],
        example: 'POST /Litium/api/admin/products/baseProducts/search with body: {"search":"laptop","take":10}',
        category: 'Products'
      },
      {
        method: 'GET',
        path: '/Litium/api/admin/products/baseProducts/{systemId}',
        description: 'Get a specific base product by system ID',
        parameters: [
          { name: 'systemId', type: 'string', required: true, description: 'Product system ID' }
        ],
        example: 'GET /Litium/api/admin/products/baseProducts/12345',
        category: 'Products'
      },
      {
        method: 'POST',
        path: '/Litium/api/admin/products/baseProducts',
        description: 'Create a new base product',
        parameters: [
          { name: 'product', type: 'object', required: true, description: 'Product data object' }
        ],
        example: 'POST /Litium/api/admin/products/baseProducts with product data in body',
        category: 'Products'
      },
      {
        method: 'PUT',
        path: '/Litium/api/admin/products/baseProducts/{systemId}',
        description: 'Update an existing base product',
        parameters: [
          { name: 'systemId', type: 'string', required: true, description: 'Product system ID' },
          { name: 'product', type: 'object', required: true, description: 'Updated product data' }
        ],
        example: 'PUT /Litium/api/admin/products/baseProducts/12345 with updated product data',
        category: 'Products'
      },
      {
        method: 'DELETE',
        path: '/Litium/api/admin/products/baseProducts/{systemId}',
        description: 'Delete a base product',
        parameters: [
          { name: 'systemId', type: 'string', required: true, description: 'Product system ID' }
        ],
        example: 'DELETE /Litium/api/admin/products/baseProducts/12345',
        category: 'Products'
      },
      {
        method: 'GET',
        path: '/Litium/api/admin/products/baseProducts/{systemId}/variants',
        description: 'Get product variants for a base product',
        parameters: [
          { name: 'systemId', type: 'string', required: true, description: 'Base product system ID' }
        ],
        example: 'GET /Litium/api/admin/products/baseProducts/12345/variants',
        category: 'Products'
      },
      {
        method: 'GET',
        path: '/Litium/api/admin/products/assortments',
        description: 'Search for assortments',
        parameters: [
          { name: 'search', type: 'string', required: false, description: 'Search term' },
          { name: 'skip', type: 'number', required: false, description: 'Pagination offset' },
          { name: 'take', type: 'number', required: false, description: 'Number of items to return' }
        ],
        example: 'GET /Litium/api/admin/products/assortments?search=electronics&take=20',
        category: 'Products'
      },
      {
        method: 'GET',
        path: '/Litium/api/admin/products/categories',
        description: 'Search for product categories',
        parameters: [
          { name: 'search', type: 'string', required: false, description: 'Search term' },
          { name: 'skip', type: 'number', required: false, description: 'Pagination offset' },
          { name: 'take', type: 'number', required: false, description: 'Number of items to return' }
        ],
        example: 'GET /Litium/api/admin/products/categories?search=electronics',
        category: 'Products'
      },

      // Blocks endpoints
      {
        method: 'GET',
        path: '/Litium/api/admin/blocks/blocks/search',
        description: 'Search for content blocks',
        parameters: [
          { name: 'search', type: 'string', required: false, description: 'Search term' },
          { name: 'skip', type: 'number', required: false, description: 'Pagination offset' },
          { name: 'take', type: 'number', required: false, description: 'Number of items to return' }
        ],
        example: 'GET /Litium/api/admin/blocks/blocks/search?search=hero&take=10',
        category: 'Blocks'
      },
      {
        method: 'GET',
        path: '/Litium/api/admin/blocks/blocks/{systemId}',
        description: 'Get a specific content block by system ID',
        parameters: [
          { name: 'systemId', type: 'string', required: true, description: 'Block system ID' }
        ],
        example: 'GET /Litium/api/admin/blocks/blocks/12345',
        category: 'Blocks'
      },
      {
        method: 'POST',
        path: '/Litium/api/admin/blocks/blocks',
        description: 'Create a new content block',
        parameters: [
          { name: 'block', type: 'object', required: true, description: 'Block data object' }
        ],
        example: 'POST /Litium/api/admin/blocks/blocks with block data in body',
        category: 'Blocks'
      },
      {
        method: 'PUT',
        path: '/Litium/api/admin/blocks/blocks/{systemId}',
        description: 'Update an existing content block',
        parameters: [
          { name: 'systemId', type: 'string', required: true, description: 'Block system ID' },
          { name: 'block', type: 'object', required: true, description: 'Updated block data' }
        ],
        example: 'PUT /Litium/api/admin/blocks/blocks/12345 with updated block data',
        category: 'Blocks'
      },
      {
        method: 'DELETE',
        path: '/Litium/api/admin/blocks/blocks/{systemId}',
        description: 'Delete a content block',
        parameters: [
          { name: 'systemId', type: 'string', required: true, description: 'Block system ID' }
        ],
        example: 'DELETE /Litium/api/admin/blocks/blocks/12345',
        category: 'Blocks'
      },
      {
        method: 'GET',
        path: '/Litium/api/admin/blocks/categories',
        description: 'Get block categories',
        parameters: [
          { name: 'search', type: 'string', required: false, description: 'Search term' },
          { name: 'skip', type: 'number', required: false, description: 'Pagination offset' },
          { name: 'take', type: 'number', required: false, description: 'Number of items to return' }
        ],
        example: 'GET /Litium/api/admin/blocks/categories?take=50',
        category: 'Blocks'
      },

      // Customers endpoints
      {
        method: 'GET',
        path: '/Litium/api/admin/customers/people',
        description: 'Search for customers (people)',
        parameters: [
          { name: 'search', type: 'string', required: false, description: 'Search term' },
          { name: 'skip', type: 'number', required: false, description: 'Pagination offset' },
          { name: 'take', type: 'number', required: false, description: 'Number of items to return' }
        ],
        example: 'GET /Litium/api/admin/customers/people?search=john&take=20',
        category: 'Customers'
      },
      {
        method: 'GET',
        path: '/Litium/api/admin/customers/people/{systemId}',
        description: 'Get a specific customer by system ID',
        parameters: [
          { name: 'systemId', type: 'string', required: true, description: 'Customer system ID' }
        ],
        example: 'GET /Litium/api/admin/customers/people/12345',
        category: 'Customers'
      },
      {
        method: 'POST',
        path: '/Litium/api/admin/customers/people',
        description: 'Create a new customer',
        parameters: [
          { name: 'customer', type: 'object', required: true, description: 'Customer data object' }
        ],
        example: 'POST /Litium/api/admin/customers/people with customer data in body',
        category: 'Customers'
      },
      {
        method: 'PUT',
        path: '/Litium/api/admin/customers/people/{systemId}',
        description: 'Update an existing customer',
        parameters: [
          { name: 'systemId', type: 'string', required: true, description: 'Customer system ID' },
          { name: 'customer', type: 'object', required: true, description: 'Updated customer data' }
        ],
        example: 'PUT /Litium/api/admin/customers/people/12345 with updated customer data',
        category: 'Customers'
      },
      {
        method: 'DELETE',
        path: '/Litium/api/admin/customers/people/{systemId}',
        description: 'Delete a customer',
        parameters: [
          { name: 'systemId', type: 'string', required: true, description: 'Customer system ID' }
        ],
        example: 'DELETE /Litium/api/admin/customers/people/12345',
        category: 'Customers'
      },

      // Media endpoints
      {
        method: 'GET',
        path: '/Litium/api/admin/media/files',
        description: 'Search for media files',
        parameters: [
          { name: 'search', type: 'string', required: false, description: 'Search term' },
          { name: 'skip', type: 'number', required: false, description: 'Pagination offset' },
          { name: 'take', type: 'number', required: false, description: 'Number of items to return' }
        ],
        example: 'GET /Litium/api/admin/media/files?search=image&take=20',
        category: 'Media'
      },
      {
        method: 'GET',
        path: '/Litium/api/admin/media/files/{systemId}',
        description: 'Get a specific media file by system ID',
        parameters: [
          { name: 'systemId', type: 'string', required: true, description: 'Media file system ID' }
        ],
        example: 'GET /Litium/api/admin/media/files/12345',
        category: 'Media'
      },

      // Websites endpoints
      {
        method: 'GET',
        path: '/Litium/api/admin/websites',
        description: 'Get all websites',
        parameters: [],
        example: 'GET /Litium/api/admin/websites',
        category: 'Websites'
      },
      {
        method: 'GET',
        path: '/Litium/api/admin/websites/{systemId}',
        description: 'Get a specific website by system ID',
        parameters: [
          { name: 'systemId', type: 'string', required: true, description: 'Website system ID' }
        ],
        example: 'GET /Litium/api/admin/websites/12345',
        category: 'Websites'
      },

      // Orders endpoints
      {
        method: 'GET',
        path: '/Litium/api/admin/orders/salesOrders',
        description: 'Search for sales orders',
        parameters: [
          { name: 'search', type: 'string', required: false, description: 'Search term' },
          { name: 'skip', type: 'number', required: false, description: 'Pagination offset' },
          { name: 'take', type: 'number', required: false, description: 'Number of items to return' }
        ],
        example: 'GET /Litium/api/admin/orders/salesOrders?search=order123&take=20',
        category: 'Orders'
      },
      {
        method: 'GET',
        path: '/Litium/api/admin/orders/salesOrders/{systemId}',
        description: 'Get a specific sales order by system ID',
        parameters: [
          { name: 'systemId', type: 'string', required: true, description: 'Order system ID' }
        ],
        example: 'GET /Litium/api/admin/orders/salesOrders/12345',
        category: 'Orders'
      }
    ];
  }

  /**
   * Get endpoints by category
   */
  async getEndpointsByCategory(category: string): Promise<ApiEndpoint[]> {
    const allEndpoints = await this.getAllEndpoints();
    return allEndpoints.filter(endpoint => endpoint.category.toLowerCase() === category.toLowerCase());
  }

  /**
   * Search endpoints by description or path
   */
  async searchEndpoints(query: string): Promise<ApiEndpoint[]> {
    const allEndpoints = await this.getAllEndpoints();
    const lowercaseQuery = query.toLowerCase();
    
    return allEndpoints.filter(endpoint => 
      endpoint.description.toLowerCase().includes(lowercaseQuery) ||
      endpoint.path.toLowerCase().includes(lowercaseQuery) ||
      endpoint.category.toLowerCase().includes(lowercaseQuery)
    );
  }

  /**
   * Get OAuth authentication information
   */
  async getOAuthInfo(): Promise<{
    tokenEndpoint: string;
    grantType: string;
    requiredParameters: string[];
    example: string;
    description: string;
  }> {
    return {
      tokenEndpoint: '/Litium/OAuth/token',
      grantType: 'client_credentials',
      requiredParameters: ['grant_type', 'client_id', 'client_secret'],
      example: 'POST /Litium/OAuth/token\nContent-Type: application/x-www-form-urlencoded\n\ngrant_type=client_credentials&client_id=your-client-id&client_secret=your-client-secret',
      description: 'OAuth2 client credentials flow for obtaining access tokens. Returns a Bearer token for API authentication.'
    };
  }

  /**
   * Get API base information
   */
  async getApiInfo(): Promise<{
    baseUrl: string;
    authentication: string;
    contentType: string;
    commonHeaders: Record<string, string>;
    rateLimiting: string;
    version: string;
  }> {
    return {
      baseUrl: 'https://your-litium-instance.com',
      authentication: 'OAuth2 Bearer Token (client credentials flow)',
      contentType: 'application/json',
      commonHeaders: {
        'Authorization': 'Bearer {access_token}',
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      rateLimiting: 'Standard rate limiting applies',
      version: 'Litium Admin Web API v1'
    };
  }
}