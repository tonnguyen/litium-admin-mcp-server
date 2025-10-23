import { z } from 'zod';
import { LitiumApiService } from '../../../../src/services/litium-api';
import { handleError, formatErrorForMCP } from '../../../../src/utils/error-handler';
import { logger } from '../../../../src/utils/logger';

export function registerSalesTools(server: any, getApiService: (req: Request) => LitiumApiService, req: Request) {
  // Order management
  server.tool(
    'manage_order',
    `Manage orders (read-only). Supported operations: search, get

API Endpoints:
- search: POST /Litium/api/admin/sales/salesOrders/search
- get: GET /Litium/api/admin/sales/salesOrders/{systemId}`,
    {
      operation: z.enum(['search', 'get']),
      systemId: z.string().optional(),
      params: z.object({
        search: z.string().optional(),
        skip: z.number().optional(),
        take: z.number().optional(),
        sort: z.string().optional(),
      }).optional(),
    },
    async ({ operation, systemId, params }: any) => {
      try {
        const apiService = getApiService(req);
        switch (operation) {
          case 'search':
            return { content: [{ type: 'text', text: JSON.stringify(await apiService.orders.searchSalesOrders(params), null, 2) }] };
          case 'get':
            return { content: [{ type: 'text', text: JSON.stringify(await apiService.orders.getSalesOrder(systemId!), null, 2) }] };
          default:
            throw new Error(`Unknown operation: ${operation}`);
        }
      } catch (error) {
        const apiError = handleError(error);
        logger.error('manage_order failed:', apiError);
        throw new Error(formatErrorForMCP(apiError));
      }
    }
  );
}

