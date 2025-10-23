import { z } from 'zod';
import { LitiumApiService } from '../../../../src/services/litium-api';
import { handleError, formatErrorForMCP } from '../../../../src/utils/error-handler';
import { logger } from '../../../../src/utils/logger';

export function registerProductTools(server: any, getApiService: (req: Request) => LitiumApiService, req: Request) {
  // Product management
  server.tool(
    'manage_product',
    `Manage Litium products (base products). Supported operations: search, get, create, update, delete, get_variants`,
    {
      operation: z.enum(['search', 'get', 'create', 'update', 'delete', 'get_variants']),
      systemId: z.string().optional(),
      data: z.any().optional(),
      params: z.object({
        search: z.string().optional(),
        skip: z.number().optional(),
        take: z.number().optional(),
        sort: z.string().optional(),
      }).optional(),
    },
    async ({ operation, systemId, data, params }: any) => {
      try {
        const apiService = getApiService(req);
        switch (operation) {
          case 'search':
            return { content: [{ type: 'text', text: JSON.stringify(await apiService.products.searchBaseProducts(params), null, 2) }] };
          case 'get':
            return { content: [{ type: 'text', text: JSON.stringify(await apiService.products.getBaseProduct(systemId!), null, 2) }] };
          case 'create':
            return { content: [{ type: 'text', text: JSON.stringify(await apiService.products.createBaseProduct(data), null, 2) }] };
          case 'update':
            return { content: [{ type: 'text', text: JSON.stringify(await apiService.products.updateBaseProduct(systemId!, data), null, 2) }] };
          case 'delete':
            await apiService.products.deleteBaseProduct(systemId!);
            return { content: [{ type: 'text', text: 'Product deleted successfully' }] };
          case 'get_variants':
            return { content: [{ type: 'text', text: JSON.stringify(await apiService.products.getProductVariants(systemId!), null, 2) }] };
          default:
            throw new Error(`Unknown operation: ${operation}`);
        }
      } catch (error) {
        const apiError = handleError(error);
        logger.error('manage_product failed:', apiError);
        throw new Error(formatErrorForMCP(apiError));
      }
    }
  );

  // Product variant management
  server.tool(
    'manage_product_variant',
    `Manage product variants. Supported operations: search, get, create, update, delete`,
    {
      operation: z.enum(['search', 'get', 'create', 'update', 'delete']),
      systemId: z.string().optional(),
      data: z.any().optional(),
      params: z.object({
        search: z.string().optional(),
        skip: z.number().optional(),
        take: z.number().optional(),
        sort: z.string().optional(),
      }).optional(),
    },
    async ({ operation, systemId, data, params }: any) => {
      try {
        const apiService = getApiService(req);
        switch (operation) {
          case 'search':
            return { content: [{ type: 'text', text: JSON.stringify(await apiService.products.searchVariants(params), null, 2) }] };
          case 'get':
            return { content: [{ type: 'text', text: JSON.stringify(await apiService.products.getVariant(systemId!), null, 2) }] };
          case 'create':
            return { content: [{ type: 'text', text: JSON.stringify(await apiService.products.createVariant(data), null, 2) }] };
          case 'update':
            return { content: [{ type: 'text', text: JSON.stringify(await apiService.products.updateVariant(systemId!, data), null, 2) }] };
          case 'delete':
            await apiService.products.deleteVariant(systemId!);
            return { content: [{ type: 'text', text: 'Variant deleted successfully' }] };
          default:
            throw new Error(`Unknown operation: ${operation}`);
        }
      } catch (error) {
        const apiError = handleError(error);
        logger.error('manage_product_variant failed:', apiError);
        throw new Error(formatErrorForMCP(apiError));
      }
    }
  );

  // Product category management
  server.tool(
    'manage_product_category',
    `Manage product categories. Supported operations: search, get, create, update, delete, get_subcategories`,
    {
      operation: z.enum(['search', 'get', 'create', 'update', 'delete', 'get_subcategories']),
      systemId: z.string().optional(),
      data: z.any().optional(),
      params: z.object({
        search: z.string().optional(),
        skip: z.number().optional(),
        take: z.number().optional(),
        sort: z.string().optional(),
      }).optional(),
    },
    async ({ operation, systemId, data, params }: any) => {
      try {
        const apiService = getApiService(req);
        switch (operation) {
          case 'search':
            return { content: [{ type: 'text', text: JSON.stringify(await apiService.products.searchCategories(params), null, 2) }] };
          case 'get':
            return { content: [{ type: 'text', text: JSON.stringify(await apiService.products.getCategory(systemId!), null, 2) }] };
          case 'create':
            return { content: [{ type: 'text', text: JSON.stringify(await apiService.products.createCategory(data), null, 2) }] };
          case 'update':
            return { content: [{ type: 'text', text: JSON.stringify(await apiService.products.updateCategory(systemId!, data), null, 2) }] };
          case 'delete':
            await apiService.products.deleteCategory(systemId!);
            return { content: [{ type: 'text', text: 'Category deleted successfully' }] };
          case 'get_subcategories':
            return { content: [{ type: 'text', text: JSON.stringify(await apiService.products.getCategorySubcategories(systemId!), null, 2) }] };
          default:
            throw new Error(`Unknown operation: ${operation}`);
        }
      } catch (error) {
        const apiError = handleError(error);
        logger.error('manage_product_category failed:', apiError);
        throw new Error(formatErrorForMCP(apiError));
      }
    }
  );

  // Product assortment management
  server.tool(
    'manage_product_assortment',
    `Manage product assortments. Supported operations: search, get, create, update, delete, get_categories`,
    {
      operation: z.enum(['search', 'get', 'create', 'update', 'delete', 'get_categories']),
      systemId: z.string().optional(),
      data: z.any().optional(),
      params: z.object({
        search: z.string().optional(),
        skip: z.number().optional(),
        take: z.number().optional(),
        sort: z.string().optional(),
      }).optional(),
    },
    async ({ operation, systemId, data, params }: any) => {
      try {
        const apiService = getApiService(req);
        switch (operation) {
          case 'search':
            return { content: [{ type: 'text', text: JSON.stringify(await apiService.products.searchAssortments(params), null, 2) }] };
          case 'get':
            return { content: [{ type: 'text', text: JSON.stringify(await apiService.products.getAssortment(systemId!), null, 2) }] };
          case 'create':
            return { content: [{ type: 'text', text: JSON.stringify(await apiService.products.createAssortment(data), null, 2) }] };
          case 'update':
            return { content: [{ type: 'text', text: JSON.stringify(await apiService.products.updateAssortment(systemId!, data), null, 2) }] };
          case 'delete':
            await apiService.products.deleteAssortment(systemId!);
            return { content: [{ type: 'text', text: 'Assortment deleted successfully' }] };
          case 'get_categories':
            return { content: [{ type: 'text', text: JSON.stringify(await apiService.products.getAssortmentCategories(systemId!), null, 2) }] };
          default:
            throw new Error(`Unknown operation: ${operation}`);
        }
      } catch (error) {
        const apiError = handleError(error);
        logger.error('manage_product_assortment failed:', apiError);
        throw new Error(formatErrorForMCP(apiError));
      }
    }
  );

  // Price list management
  server.tool(
    'manage_price_list',
    `Manage price lists. Supported operations: search, get, create, update, delete, get_items`,
    {
      operation: z.enum(['search', 'get', 'create', 'update', 'delete', 'get_items']),
      systemId: z.string().optional(),
      data: z.any().optional(),
      params: z.object({
        search: z.string().optional(),
        skip: z.number().optional(),
        take: z.number().optional(),
        sort: z.string().optional(),
      }).optional(),
    },
    async ({ operation, systemId, data, params }: any) => {
      try {
        const apiService = getApiService(req);
        switch (operation) {
          case 'search':
            return { content: [{ type: 'text', text: JSON.stringify(await apiService.products.searchPriceLists(params), null, 2) }] };
          case 'get':
            return { content: [{ type: 'text', text: JSON.stringify(await apiService.products.getPriceList(systemId!), null, 2) }] };
          case 'create':
            return { content: [{ type: 'text', text: JSON.stringify(await apiService.products.createPriceList(data), null, 2) }] };
          case 'update':
            return { content: [{ type: 'text', text: JSON.stringify(await apiService.products.updatePriceList(systemId!, data), null, 2) }] };
          case 'delete':
            await apiService.products.deletePriceList(systemId!);
            return { content: [{ type: 'text', text: 'Price list deleted successfully' }] };
          case 'get_items':
            return { content: [{ type: 'text', text: JSON.stringify(await apiService.products.getPriceListItems(systemId!), null, 2) }] };
          default:
            throw new Error(`Unknown operation: ${operation}`);
        }
      } catch (error) {
        const apiError = handleError(error);
        logger.error('manage_price_list failed:', apiError);
        throw new Error(formatErrorForMCP(apiError));
      }
    }
  );

  // Relationship type management
  server.tool(
    'manage_relationship_type',
    `Manage product relationship types. Supported operations: list, get, create, update, delete`,
    {
      operation: z.enum(['list', 'get', 'create', 'update', 'delete']),
      systemId: z.string().optional(),
      data: z.any().optional(),
    },
    async ({ operation, systemId, data }: any) => {
      try {
        const apiService = getApiService(req);
        switch (operation) {
          case 'list':
            return { content: [{ type: 'text', text: JSON.stringify(await apiService.products.getRelationshipTypes(), null, 2) }] };
          case 'get':
            return { content: [{ type: 'text', text: JSON.stringify(await apiService.products.getRelationshipType(systemId!), null, 2) }] };
          case 'create':
            return { content: [{ type: 'text', text: JSON.stringify(await apiService.products.createRelationshipType(data), null, 2) }] };
          case 'update':
            return { content: [{ type: 'text', text: JSON.stringify(await apiService.products.updateRelationshipType(systemId!, data), null, 2) }] };
          case 'delete':
            await apiService.products.deleteRelationshipType(systemId!);
            return { content: [{ type: 'text', text: 'Relationship type deleted successfully' }] };
          default:
            throw new Error(`Unknown operation: ${operation}`);
        }
      } catch (error) {
        const apiError = handleError(error);
        logger.error('manage_relationship_type failed:', apiError);
        throw new Error(formatErrorForMCP(apiError));
      }
    }
  );
}

