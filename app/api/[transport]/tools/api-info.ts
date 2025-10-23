import { z } from 'zod';
import { LitiumApiService } from '../../../../src/services/litium-api';
import { handleError, formatErrorForMCP } from '../../../../src/utils/error-handler';
import { logger } from '../../../../src/utils/logger';

export function registerApiInfoTools(server: any, getApiService: (req: Request) => LitiumApiService, req: Request) {
  server.tool(
    'get_api_info',
    `Get Litium API information. Supported types: full, quick, oauth, endpoints`,
    {
      type: z.enum(['full', 'quick', 'oauth', 'endpoints']),
      category: z.string().optional(),
      search: z.string().optional(),
    },
    async ({ type, category, search }: any) => {
      try {
        const apiService = getApiService(req);
        switch (type) {
          case 'full':
            return { content: [{ type: 'text', text: JSON.stringify(await apiService.documentation.getFullDocumentation(), null, 2) }] };
          case 'quick':
            return { content: [{ type: 'text', text: JSON.stringify(await apiService.documentation.getQuickReference(), null, 2) }] };
          case 'oauth':
            return { content: [{ type: 'text', text: JSON.stringify(await apiService.discovery.getOAuthInfo(), null, 2) }] };
          case 'endpoints':
            if (search) {
              return { content: [{ type: 'text', text: JSON.stringify(await apiService.discovery.searchEndpoints(search), null, 2) }] };
            } else if (category) {
              return { content: [{ type: 'text', text: JSON.stringify(await apiService.discovery.getEndpointsByCategory(category), null, 2) }] };
            } else {
              return { content: [{ type: 'text', text: JSON.stringify(await apiService.discovery.getAllEndpoints(), null, 2) }] };
            }
          default:
            throw new Error(`Unknown type: ${type}`);
        }
      } catch (error) {
        const apiError = handleError(error);
        logger.error('get_api_info failed:', apiError);
        throw new Error(formatErrorForMCP(apiError));
      }
    }
  );
}
