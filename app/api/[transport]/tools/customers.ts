import { z } from 'zod';
import { LitiumApiService } from '../../../../src/services/litium-api';
import { handleError, formatErrorForMCP } from '../../../../src/utils/error-handler';
import { logger } from '../../../../src/utils/logger';

export function registerCustomerTools(server: any, getApiService: (req: Request) => LitiumApiService, req: Request) {
  // Customer management
  server.tool(
    'manage_customer',
    `Manage customers. Supported operations: search, get, create, update, delete`,
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
            return { content: [{ type: 'text', text: JSON.stringify(await apiService.customers.searchCustomers(params), null, 2) }] };
          case 'get':
            return { content: [{ type: 'text', text: JSON.stringify(await apiService.customers.getCustomer(systemId!), null, 2) }] };
          case 'create':
            return { content: [{ type: 'text', text: JSON.stringify(await apiService.customers.createCustomer(data), null, 2) }] };
          case 'update':
            return { content: [{ type: 'text', text: JSON.stringify(await apiService.customers.updateCustomer(systemId!, data), null, 2) }] };
          case 'delete':
            await apiService.customers.deleteCustomer(systemId!);
            return { content: [{ type: 'text', text: 'Customer deleted successfully' }] };
          default:
            throw new Error(`Unknown operation: ${operation}`);
        }
      } catch (error) {
        const apiError = handleError(error);
        logger.error('manage_customer failed:', apiError);
        throw new Error(formatErrorForMCP(apiError));
      }
    }
  );
}

