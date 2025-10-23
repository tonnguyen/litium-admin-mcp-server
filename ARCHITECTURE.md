# Architecture Overview

This document describes the architecture and organization of the Litium Admin MCP Server.

## 🏗️ Project Structure

```
app/                            # Next.js App Router
├── api/
│   └── [transport]/           # HTTP MCP server endpoint
│       ├── route.ts           # Main HTTP handler (minimal - 64 lines)
│       └── tools/             # Domain-specific tool handlers
│           ├── index.ts       # Tool registration orchestrator
│           ├── products.ts    # Product domain tools (6 tools)
│           ├── content.ts     # Content domain tools (2 tools)
│           ├── media.ts       # Media domain tools (1 tool)
│           ├── websites.ts    # Website domain tools (1 tool)
│           ├── customers.ts   # Customer domain tools (1 tool)
│           ├── sales.ts       # Sales/Order domain tools (1 tool)
│           ├── globalization.ts # Globalization tools (5 tools)
│           └── api-info.ts    # API documentation tools (1 tool)
├── layout.tsx                 # Root layout
└── page.tsx                   # Homepage with docs link

src/
├── auth/                      # Authentication layer
│   └── token-manager.ts       # OAuth2 token management
├── services/                  # API service layer (domain-based)
│   ├── base-api.ts           # Base service with common functionality
│   ├── litium-api.ts         # Main API service (orchestrator)
│   ├── blocks/               # Content blocks domain
│   │   ├── index.ts
│   │   └── blocks-service.ts
│   ├── products/             # Products domain
│   │   ├── index.ts
│   │   └── products-service.ts
│   ├── customers/            # Customers domain
│   │   ├── index.ts
│   │   └── customers-service.ts
│   ├── media/                # Media files domain
│   │   ├── index.ts
│   │   └── media-service.ts
│   ├── websites/             # Websites domain
│   │   ├── index.ts
│   │   └── websites-service.ts
│   ├── orders/               # Orders/Sales domain
│   │   ├── index.ts
│   │   └── orders-service.ts
│   ├── globalization/        # Globalization domain
│   │   ├── index.ts
│   │   └── globalization-service.ts
│   ├── api-discovery/        # API discovery domain
│   │   ├── index.ts
│   │   └── api-discovery-service.ts
│   └── api-documentation/    # API documentation domain
│       ├── index.ts
│       └── api-documentation-service.ts
├── types/                    # TypeScript type definitions
│   ├── auth.ts              # Authentication types
│   └── config.ts            # Configuration types
└── utils/                    # Utility functions
    ├── config.ts            # Configuration management
    ├── error-handler.ts     # Error handling utilities
    └── logger.ts            # Logging utilities
```

## 🔧 Design Patterns

### 1. Domain-Driven Design (DDD)

Both the MCP tools and API services are organized by business domains:

#### MCP Tool Domains (18 consolidated tools):
- **Products** (6 tools): Product management, variants, categories, price lists, relationship types
- **Content** (2 tools): Blocks and pages
- **Media** (1 tool): Media files and folders
- **Websites** (1 tool): Website configuration
- **Customers** (1 tool): Customer management
- **Sales** (1 tool): Orders and sales operations
- **Globalization** (5 tools): Languages, markets, countries, currencies, display templates
- **API Info** (1 tool): API documentation and discovery

#### API Service Domains:
- **Blocks**: Content management (pages, blocks, categories)
- **Products**: Product catalog (products, categories, assortments, variants, price lists)
- **Customers**: Customer management (people, groups, organizations)
- **Media**: Media management (files, folders, file types)
- **Websites**: Website configuration
- **Orders**: Sales and order management
- **Globalization**: Multi-language and multi-market support
- **API Discovery**: API endpoint discovery
- **API Documentation**: API reference documentation

### 2. Service Layer Pattern

Each domain has its own service class that encapsulates:
- API endpoint interactions
- Data transformation
- Error handling
- Business logic

### 3. Modular Tool Architecture (HTTP Transport)

The MCP server uses a modular architecture where tools are organized by domain:

**Tool Structure**:
- Each domain has its own file in `app/api/[transport]/tools/`
- Tools use Zod for schema validation
- Each tool supports multiple operations via an `operation` parameter
- Tool handlers are registered via registration functions

**Benefits**:
- **Reduced Tool Count**: 18 domain-based tools vs. 107 individual tools
- **Better Performance**: Fewer tools for AI models to process
- **Easier Navigation**: Find tools by business domain
- **Smaller Files**: Each file is 40-250 lines (maintainable)
- **Clearer Separation**: Tool registration separate from business logic

### 4. Base Service Pattern

All domain services extend `BaseApiService` which provides:
- Common HTTP operations (GET, POST, PUT, DELETE)
- Search functionality
- Authentication handling
- Error management

## 📦 Service Classes

### BaseApiService

The foundation class that all domain services extend:

```typescript
export abstract class BaseApiService {
  protected tokenManager: TokenManager;
  
  // Generic CRUD operations
  protected async search<T>(endpoint: string, params?: SearchParams): Promise<T>
  protected async searchPost<T>(endpoint: string, params?: SearchParams): Promise<T>
  protected async get<T>(endpoint: string): Promise<T>
  protected async create<T>(endpoint: string, data: any): Promise<T>
  protected async update<T>(endpoint: string, data: any): Promise<T>
  protected async delete(endpoint: string): Promise<void>
}
```

### Domain Services

Each domain service provides methods specific to that domain:

#### BlocksService
- Content block management
- Block categories
- Draft blocks
- Field definitions and templates

#### ProductsService
- Base products
- Product variants
- Assortments
- Product categories

#### CustomersService
- Customer management (people)
- Customer groups
- Organizations
- Address types

#### MediaService
- Media files
- Media folders
- File types
- Field definitions

#### WebsitesService
- Website configuration
- Website groups
- Field definitions

#### OrdersService
- Sales orders
- Return orders
- Shipments
- Payments
- Campaigns and discounts

#### GlobalizationService
- Languages and translations
- Markets and countries
- Currencies
- Display templates

#### ApiDiscoveryService
- Endpoint discovery
- API exploration

#### ApiDocumentationService
- API reference
- Quick reference guides

## 🔄 Data Flow

### HTTP MCP Request Flow

```
MCP Client (Cursor/Claude) 
    ↓ (HTTP POST with headers)
app/api/[transport]/route.ts
    ↓ (Extract credentials from headers)
getApiService(req)
    ↓ (Create LitiumApiService)
Domain Tool Handler (app/api/[transport]/tools/*.ts)
    ↓ (Call operation)
Domain Service (src/services/*-service.ts)
    ↓ (API call)
BaseApiService
    ↓ (OAuth2 token)
TokenManager
    ↓ (Authenticated request)
Litium Admin Web API
    ↓ (JSON response)
← Response flows back up the chain
```

### Legacy Data Flow (for reference)

```
MCP Request → LitiumApiService → Domain Service → BaseApiService → TokenManager → Litium API
     ↓
Response ← JSON ← HTTP Response ← Litium API ← Authenticated Request ← TokenManager
```

## 🎯 Usage Patterns

### Direct Domain Access
```typescript
// Access domain services directly
const blocks = await api.blocks.searchBlocks({ search: 'test' });
const products = await api.products.searchBaseProducts({ take: 10 });
const customers = await api.customers.searchCustomers({ search: 'john' });
```

### Service-Specific Operations
```typescript
// Access domain-specific methods
const blockCategories = await api.blocks.getCategories();
const productVariants = await api.products.getProductVariants(systemId);
const customerGroups = await api.customers.searchCustomerGroups();
```

## 🛠️ Usage Examples

### Direct Service Usage

```typescript
import { LitiumApiService } from './services/litium-api.js';

const api = new LitiumApiService(config);

// Use specific domain services
const blocks = await api.blocks.searchBlocks({ search: 'test' });
const products = await api.products.searchBaseProducts({ take: 10 });
const customers = await api.customers.searchCustomers({ search: 'john' });
```

### Direct Service Usage

```typescript
// Use domain-specific services directly
const blocks = await api.blocks.searchBlocks({ search: 'test' });
const products = await api.products.searchBaseProducts({ take: 10 });
const customers = await api.customers.searchCustomers({ search: 'john' });
```

## 🔧 Adding New Tools

To add a new MCP tool to the HTTP server:

### 1. Create or update domain tool file

Create or update `app/api/[transport]/tools/my-domain.ts`:

```typescript
import { z } from 'zod';
import { LitiumApiService } from '../../../../src/services/litium-api';
import { handleError, formatErrorForMCP } from '../../../../src/utils/error-handler';
import { logger } from '../../../../src/utils/logger';

export function registerMyDomainTools(server: any, getApiService: (req: Request) => LitiumApiService, req: Request) {
  server.tool(
    'manage_my_entity',
    `Manage my entities. Supported operations: search, get, create, update, delete`,
    {
      operation: z.enum(['search', 'get', 'create', 'update', 'delete']),
      systemId: z.string().optional(),
      data: z.any().optional(),
      params: z.object({
        search: z.string().optional(),
        skip: z.number().optional(),
        take: z.number().optional(),
      }).optional(),
    },
    async ({ operation, systemId, data, params }: any) => {
      try {
        const apiService = getApiService(req);
        switch (operation) {
          case 'search':
            return { content: [{ type: 'text', text: JSON.stringify(await apiService.myDomain.searchItems(params), null, 2) }] };
          case 'get':
            return { content: [{ type: 'text', text: JSON.stringify(await apiService.myDomain.getItem(systemId!), null, 2) }] };
          // ... other operations
          default:
            throw new Error(`Unknown operation: ${operation}`);
        }
      } catch (error) {
        const apiError = handleError(error);
        logger.error('manage_my_entity failed:', apiError);
        throw new Error(formatErrorForMCP(apiError));
      }
    }
  );
}
```

### 2. Register tool in main route

Update `app/api/[transport]/route.ts`:

```typescript
import { registerMyDomainTools } from './tools/my-domain';

const handler = async (req: Request) => {
  return createMcpHandler(
    (server) => {
      // ... existing registrations
      registerMyDomainTools(server, getApiService, req);
    },
    // ... server config
  )(req);
};
```

### 3. Create documentation

Create `docs/tools/my-domain/manage-my-entity.mdx` following the existing documentation structure.

## 🔧 Adding New Services

To add a new domain service:

1. **Create the service directory**:
   ```bash
   mkdir src/services/new-domain
   ```

2. **Create the service class**:
   ```typescript
   // src/services/new-domain/new-domain-service.ts
   import { BaseApiService } from '../base-api.js';
   import { type LitiumConfig } from '../../types/config.js';

   export class NewDomainService extends BaseApiService {
     constructor(config: LitiumConfig) {
       super(config);
     }

     async searchItems(params?: SearchParams) {
       return this.search<any>('/api/new-domain/items', params);
     }

     async getItem(systemId: string) {
       return this.get<any>(`/api/new-domain/items/${systemId}`);
     }
   }
   ```

3. **Create an index file**:
   ```typescript
   // src/services/new-domain/index.ts
   export { NewDomainService } from './new-domain-service.js';
   ```

4. **Add to main service**:
   ```typescript
   // src/services/litium-api.ts
   import { NewDomainService } from './new-domain/new-domain-service.js';

   export class LitiumApiService {
     public readonly newDomain: NewDomainService;
     
     constructor(config: LitiumConfig) {
       this.newDomain = new NewDomainService(config);
     }
   }
   ```

## 🧪 Testing

Each service can be tested independently:

```typescript
import { BlocksService } from './services/blocks/blocks-service.js';

const blocksService = new BlocksService(mockConfig);
const result = await blocksService.searchBlocks({ search: 'test' });
```

## 📈 Benefits

### Maintainability
- **Single Responsibility**: Each service handles one domain
- **Easy to Find**: Code is organized by business domain
- **Independent Changes**: Changes to one domain don't affect others

### Scalability
- **Add New Domains**: Easy to add new services
- **Team Development**: Different teams can work on different domains
- **Selective Loading**: Only load services you need

### Testability
- **Unit Testing**: Each service can be tested independently
- **Mocking**: Easy to mock individual services
- **Integration Testing**: Test specific domain interactions

### Code Reuse
- **Common Functionality**: BaseApiService provides shared functionality
- **Consistent Patterns**: All services follow the same patterns
- **DRY Principle**: No duplication of common code

## 🔍 Best Practices

1. **Keep Services Focused**: Each service should handle one domain
2. **Use BaseApiService**: Extend the base class for common functionality
3. **Consistent Naming**: Follow the established naming conventions
4. **Error Handling**: Use the centralized error handling
5. **Type Safety**: Use TypeScript types for better development experience
6. **Documentation**: Document public methods and their parameters

## 🚀 Future Enhancements

### Tool Layer
- **Tool Testing**: Automated testing for each domain tool
- **Tool Metrics**: Track tool usage and performance
- **Tool Documentation**: Auto-generate tool docs from schemas

### Service Layer
- **Caching Layer**: Add caching for frequently accessed data
- **Rate Limiting**: Implement rate limiting per service
- **Metrics**: Add performance metrics for each service
- **Validation**: Add input validation for service methods
- **Pagination**: Standardize pagination across all services

### Transport Layer
- **WebSocket Support**: Add real-time updates via WebSocket
- **Request Batching**: Batch multiple operations in one request
- **Response Streaming**: Stream large responses for better performance