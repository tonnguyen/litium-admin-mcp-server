# Architecture Overview

This document describes the architecture and organization of the Litium Admin MCP Server.

## 🏗️ Project Structure

```
src/
├── auth/                    # Authentication layer
│   └── token-manager.ts    # OAuth2 token management
├── services/               # API service layer (domain-based)
│   ├── base-api.ts         # Base service with common functionality
│   ├── litium-api.ts       # Main API service (orchestrator)
│   ├── blocks/             # Content blocks domain
│   │   ├── index.ts
│   │   └── blocks-service.ts
│   ├── products/           # Products domain
│   │   ├── index.ts
│   │   └── products-service.ts
│   ├── customers/          # Customers domain
│   │   ├── index.ts
│   │   └── customers-service.ts
│   ├── media/              # Media files domain
│   │   ├── index.ts
│   │   └── media-service.ts
│   ├── websites/           # Websites domain
│   │   ├── index.ts
│   │   └── websites-service.ts
│   └── orders/             # Orders domain
│       ├── index.ts
│       └── orders-service.ts
├── types/                  # TypeScript type definitions
│   ├── auth.ts            # Authentication types
│   └── config.ts          # Configuration types
├── utils/                  # Utility functions
│   ├── config.ts          # Configuration management
│   ├── error-handler.ts   # Error handling utilities
│   └── logger.ts          # Logging utilities
└── index.ts               # Main MCP server implementation
```

## 🔧 Design Patterns

### 1. Domain-Driven Design (DDD)

The services are organized by business domains:
- **Blocks**: Content management (pages, blocks, categories)
- **Products**: Product catalog (products, categories, assortments)
- **Customers**: Customer management (people, groups, organizations)
- **Media**: Media management (files, folders, file types)
- **Websites**: Website configuration
- **Orders**: Sales and order management

### 2. Service Layer Pattern

Each domain has its own service class that encapsulates:
- API endpoint interactions
- Data transformation
- Error handling
- Business logic

### 3. Base Service Pattern

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

## 🔄 Data Flow

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

- **Caching Layer**: Add caching for frequently accessed data
- **Rate Limiting**: Implement rate limiting per service
- **Metrics**: Add performance metrics for each service
- **Validation**: Add input validation for service methods
- **Pagination**: Standardize pagination across all services