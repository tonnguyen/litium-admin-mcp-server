import { BaseApiService } from '../base-api';
import { type LitiumConfig } from '../../types/config';

export interface ApiDocumentation {
  title: string;
  version: string;
  description: string;
  baseUrl: string;
  authentication: {
    type: string;
    method: string;
    tokenEndpoint: string;
    requiredHeaders: string[];
    example: string;
  };
  commonPatterns: {
    searchPattern: string;
    getByIdPattern: string;
    createPattern: string;
    updatePattern: string;
    deletePattern: string;
  };
  endpoints: {
    [category: string]: {
      description: string;
      basePath: string;
      operations: Array<{
        method: string;
        path: string;
        description: string;
        parameters?: Array<{
          name: string;
          type: string;
          required: boolean;
          description: string;
        }>;
        example: string;
      }>;
    };
  };
  examples: {
    authentication: string;
    searchProducts: string;
    getProduct: string;
    createProduct: string;
    searchBlocks: string;
    getBlock: string;
  };
}

export class ApiDocumentationService extends BaseApiService {
  constructor(config: LitiumConfig) {
    super(config);
  }

  /**
   * Get comprehensive API documentation
   */
  async getFullDocumentation(): Promise<ApiDocumentation> {
    return {
      title: 'Litium Admin Web API',
      version: '1.0',
      description: 'Complete REST API for managing Litium e-commerce platform including products, customers, content blocks, media, websites, and orders.',
      baseUrl: 'https://your-litium-instance.com',
      authentication: {
        type: 'OAuth2',
        method: 'Client Credentials Flow',
        tokenEndpoint: '/Litium/OAuth/token',
        requiredHeaders: ['Authorization', 'Content-Type', 'Accept'],
        example: `POST /Litium/OAuth/token
Content-Type: application/x-www-form-urlencoded

grant_type=client_credentials&client_id=your-client-id&client_secret=your-client-secret

Response:
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "Bearer",
  "expires_in": 3600
}`
      },
      commonPatterns: {
        searchPattern: 'GET /Litium/api/admin/{domain}/{resource}?search={query}&skip={offset}&take={limit}',
        getByIdPattern: 'GET /Litium/api/admin/{domain}/{resource}/{systemId}',
        createPattern: 'POST /Litium/api/admin/{domain}/{resource}',
        updatePattern: 'PUT /Litium/api/admin/{domain}/{resource}/{systemId}',
        deletePattern: 'DELETE /Litium/api/admin/{domain}/{resource}/{systemId}'
      },
      endpoints: {
        Authentication: {
          description: 'OAuth2 authentication endpoints',
          basePath: '/Litium/OAuth',
          operations: [
            {
              method: 'POST',
              path: '/token',
              description: 'Obtain access token using client credentials',
              parameters: [
                { name: 'grant_type', type: 'string', required: true, description: 'Must be "client_credentials"' },
                { name: 'client_id', type: 'string', required: true, description: 'OAuth2 client ID' },
                { name: 'client_secret', type: 'string', required: true, description: 'OAuth2 client secret' }
              ],
              example: 'POST /Litium/OAuth/token with form data: grant_type=client_credentials&client_id=xxx&client_secret=xxx'
            }
          ]
        },
        Products: {
          description: 'Product catalog management including base products, variants, assortments, and categories',
          basePath: '/Litium/api/admin/products',
          operations: [
            {
              method: 'POST',
              path: '/baseProducts/search',
              description: 'Search for base products (use POST for search, not GET)',
              parameters: [
                { name: 'search', type: 'string', required: false, description: 'Search term' },
                { name: 'skip', type: 'number', required: false, description: 'Pagination offset' },
                { name: 'take', type: 'number', required: false, description: 'Number of items to return' },
                { name: 'sort', type: 'string', required: false, description: 'Sort order' }
              ],
              example: 'POST /Litium/api/admin/products/baseProducts/search with body: {"search":"laptop","take":10}'
            },
            {
              method: 'GET',
              path: '/baseProducts/{systemId}',
              description: 'Get a specific base product by system ID',
              parameters: [
                { name: 'systemId', type: 'string', required: true, description: 'Product system ID' }
              ],
              example: 'GET /Litium/api/admin/products/baseProducts/12345'
            },
            {
              method: 'GET',
              path: '/baseProducts/{systemId}/variants',
              description: 'Get product variants for a base product',
              parameters: [
                { name: 'systemId', type: 'string', required: true, description: 'Base product system ID' }
              ],
              example: 'GET /Litium/api/admin/products/baseProducts/12345/variants'
            },
            {
              method: 'GET',
              path: '/assortments',
              description: 'Search for assortments',
              parameters: [
                { name: 'search', type: 'string', required: false, description: 'Search term' },
                { name: 'skip', type: 'number', required: false, description: 'Pagination offset' },
                { name: 'take', type: 'number', required: false, description: 'Number of items to return' }
              ],
              example: 'GET /Litium/api/admin/products/assortments?search=electronics&take=20'
            },
            {
              method: 'GET',
              path: '/categories',
              description: 'Search for product categories',
              parameters: [
                { name: 'search', type: 'string', required: false, description: 'Search term' },
                { name: 'skip', type: 'number', required: false, description: 'Pagination offset' },
                { name: 'take', type: 'number', required: false, description: 'Number of items to return' }
              ],
              example: 'GET /Litium/api/admin/products/categories?search=electronics'
            }
          ]
        },
        Blocks: {
          description: 'Content management including blocks, categories, and field definitions',
          basePath: '/Litium/api/admin/blocks',
          operations: [
            {
              method: 'GET',
              path: '/blocks/search',
              description: 'Search for content blocks',
              parameters: [
                { name: 'search', type: 'string', required: false, description: 'Search term' },
                { name: 'skip', type: 'number', required: false, description: 'Pagination offset' },
                { name: 'take', type: 'number', required: false, description: 'Number of items to return' }
              ],
              example: 'GET /Litium/api/admin/blocks/blocks/search?search=hero&take=10'
            },
            {
              method: 'GET',
              path: '/blocks/{systemId}',
              description: 'Get a specific content block by system ID',
              parameters: [
                { name: 'systemId', type: 'string', required: true, description: 'Block system ID' }
              ],
              example: 'GET /Litium/api/admin/blocks/blocks/12345'
            },
            {
              method: 'GET',
              path: '/categories',
              description: 'Get block categories',
              parameters: [
                { name: 'search', type: 'string', required: false, description: 'Search term' },
                { name: 'skip', type: 'number', required: false, description: 'Pagination offset' },
                { name: 'take', type: 'number', required: false, description: 'Number of items to return' }
              ],
              example: 'GET /Litium/api/admin/blocks/categories?take=50'
            }
          ]
        },
        Customers: {
          description: 'Customer management including people, groups, and organizations',
          basePath: '/Litium/api/admin/customers',
          operations: [
            {
              method: 'GET',
              path: '/people',
              description: 'Search for customers (people)',
              parameters: [
                { name: 'search', type: 'string', required: false, description: 'Search term' },
                { name: 'skip', type: 'number', required: false, description: 'Pagination offset' },
                { name: 'take', type: 'number', required: false, description: 'Number of items to return' }
              ],
              example: 'GET /Litium/api/admin/customers/people?search=john&take=20'
            },
            {
              method: 'GET',
              path: '/people/{systemId}',
              description: 'Get a specific customer by system ID',
              parameters: [
                { name: 'systemId', type: 'string', required: true, description: 'Customer system ID' }
              ],
              example: 'GET /Litium/api/admin/customers/people/12345'
            }
          ]
        },
        Media: {
          description: 'Media file management including files, folders, and file types',
          basePath: '/Litium/api/admin/media',
          operations: [
            {
              method: 'GET',
              path: '/files',
              description: 'Search for media files',
              parameters: [
                { name: 'search', type: 'string', required: false, description: 'Search term' },
                { name: 'skip', type: 'number', required: false, description: 'Pagination offset' },
                { name: 'take', type: 'number', required: false, description: 'Number of items to return' }
              ],
              example: 'GET /Litium/api/admin/media/files?search=image&take=20'
            },
            {
              method: 'GET',
              path: '/files/{systemId}',
              description: 'Get a specific media file by system ID',
              parameters: [
                { name: 'systemId', type: 'string', required: true, description: 'Media file system ID' }
              ],
              example: 'GET /Litium/api/admin/media/files/12345'
            }
          ]
        },
        Websites: {
          description: 'Website configuration and management',
          basePath: '/Litium/api/admin/websites',
          operations: [
            {
              method: 'GET',
              path: '/',
              description: 'Get all websites',
              parameters: [],
              example: 'GET /Litium/api/admin/websites'
            },
            {
              method: 'GET',
              path: '/{systemId}',
              description: 'Get a specific website by system ID',
              parameters: [
                { name: 'systemId', type: 'string', required: true, description: 'Website system ID' }
              ],
              example: 'GET /Litium/api/admin/websites/12345'
            }
          ]
        },
        Orders: {
          description: 'Order management including sales orders, returns, and shipments',
          basePath: '/Litium/api/admin/orders',
          operations: [
            {
              method: 'GET',
              path: '/salesOrders',
              description: 'Search for sales orders',
              parameters: [
                { name: 'search', type: 'string', required: false, description: 'Search term' },
                { name: 'skip', type: 'number', required: false, description: 'Pagination offset' },
                { name: 'take', type: 'number', required: false, description: 'Number of items to return' }
              ],
              example: 'GET /Litium/api/admin/orders/salesOrders?search=order123&take=20'
            },
            {
              method: 'GET',
              path: '/salesOrders/{systemId}',
              description: 'Get a specific sales order by system ID',
              parameters: [
                { name: 'systemId', type: 'string', required: true, description: 'Order system ID' }
              ],
              example: 'GET /Litium/api/admin/orders/salesOrders/12345'
            }
          ]
        }
      },
      examples: {
        authentication: `// Step 1: Get OAuth token
POST https://your-litium-instance.com/Litium/OAuth/token
Content-Type: application/x-www-form-urlencoded

grant_type=client_credentials&client_id=your-client-id&client_secret=your-client-secret

// Step 2: Use token in API calls
GET https://your-litium-instance.com/Litium/api/admin/products/baseProducts/12345
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json`,
        searchProducts: `POST https://your-litium-instance.com/Litium/api/admin/products/baseProducts/search
Authorization: Bearer {access_token}
Content-Type: application/json

{
  "search": "laptop",
  "take": 10,
  "skip": 0
}`,
        getProduct: `GET https://your-litium-instance.com/Litium/api/admin/products/baseProducts/12345
Authorization: Bearer {access_token}
Content-Type: application/json`,
        createProduct: `POST https://your-litium-instance.com/Litium/api/admin/products/baseProducts
Authorization: Bearer {access_token}
Content-Type: application/json

{
  "name": "New Product",
  "description": "Product description",
  "price": 99.99
}`,
        searchBlocks: `GET https://your-litium-instance.com/Litium/api/admin/blocks/blocks/search?search=hero&take=10
Authorization: Bearer {access_token}
Content-Type: application/json`,
        getBlock: `GET https://your-litium-instance.com/Litium/api/admin/blocks/blocks/12345
Authorization: Bearer {access_token}
Content-Type: application/json`
      }
    };
  }

  /**
   * Get quick reference for common operations
   */
  async getQuickReference(): Promise<{
    commonEndpoints: Array<{
      operation: string;
      method: string;
      endpoint: string;
      description: string;
    }>;
    authentication: string;
    baseUrl: string;
  }> {
    return {
      commonEndpoints: [
        { operation: 'Search Products', method: 'POST', endpoint: '/Litium/api/admin/products/baseProducts/search', description: 'Search for products (use POST, not GET)' },
        { operation: 'Get Product', method: 'GET', endpoint: '/Litium/api/admin/products/baseProducts/{systemId}', description: 'Get product by ID' },
        { operation: 'Search Blocks', method: 'GET', endpoint: '/Litium/api/admin/blocks/blocks/search', description: 'Search for content blocks' },
        { operation: 'Get Block', method: 'GET', endpoint: '/Litium/api/admin/blocks/blocks/{systemId}', description: 'Get block by ID' },
        { operation: 'Search Customers', method: 'GET', endpoint: '/Litium/api/admin/customers/people', description: 'Search for customers' },
        { operation: 'Get Customer', method: 'GET', endpoint: '/Litium/api/admin/customers/people/{systemId}', description: 'Get customer by ID' },
        { operation: 'Search Media', method: 'GET', endpoint: '/Litium/api/admin/media/files', description: 'Search for media files' },
        { operation: 'Get Media', method: 'GET', endpoint: '/Litium/api/admin/media/files/{systemId}', description: 'Get media file by ID' },
        { operation: 'Get Websites', method: 'GET', endpoint: '/Litium/api/admin/websites', description: 'Get all websites' },
        { operation: 'Search Orders', method: 'GET', endpoint: '/Litium/api/admin/orders/salesOrders', description: 'Search for sales orders' }
      ],
      authentication: 'OAuth2 Bearer Token via /Litium/OAuth/token endpoint',
      baseUrl: 'https://your-litium-instance.com'
    };
  }
}