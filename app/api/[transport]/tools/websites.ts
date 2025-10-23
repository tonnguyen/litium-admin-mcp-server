import { z } from 'zod';
import { LitiumApiService } from '../../../../src/services/litium-api';
import { handleError, formatErrorForMCP } from '../../../../src/utils/error-handler';
import { logger } from '../../../../src/utils/logger';

export function registerWebsiteTools(server: any, getApiService: (req: Request) => LitiumApiService, req: Request) {
  server.tool(
    'manage_website',
    `Manage websites and URL redirects. Supported operations: list, get, search_redirects, get_redirect, create_redirect, update_redirect, delete_redirect

API Endpoints (Websites):
- list: GET /Litium/api/admin/websites/websites
- get: GET /Litium/api/admin/websites/websites/{systemId}

API Endpoints (URL Redirects):
- search_redirects: POST /Litium/api/admin/websites/urlRedirects/search
- get_redirect: GET /Litium/api/admin/websites/urlRedirects/{systemId}
- create_redirect: POST /Litium/api/admin/websites/urlRedirects
- update_redirect: PUT /Litium/api/admin/websites/urlRedirects/{systemId}
- delete_redirect: DELETE /Litium/api/admin/websites/urlRedirects/{systemId}`,
    {
      operation: z.enum(['list', 'get', 'search_redirects', 'get_redirect', 'create_redirect', 'update_redirect', 'delete_redirect']),
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
          case 'list':
            return { content: [{ type: 'text', text: JSON.stringify(await apiService.websites.getWebsites(), null, 2) }] };
          case 'get':
            return { content: [{ type: 'text', text: JSON.stringify(await apiService.websites.getWebsite(systemId!), null, 2) }] };
          case 'search_redirects':
            return { content: [{ type: 'text', text: JSON.stringify(await apiService.websites.searchUrlRedirects(params), null, 2) }] };
          case 'get_redirect':
            return { content: [{ type: 'text', text: JSON.stringify(await apiService.websites.getUrlRedirect(systemId!), null, 2) }] };
          case 'create_redirect':
            return { content: [{ type: 'text', text: JSON.stringify(await apiService.websites.createUrlRedirect(data), null, 2) }] };
          case 'update_redirect':
            return { content: [{ type: 'text', text: JSON.stringify(await apiService.websites.updateUrlRedirect(systemId!, data), null, 2) }] };
          case 'delete_redirect':
            await apiService.websites.deleteUrlRedirect(systemId!);
            return { content: [{ type: 'text', text: 'URL redirect deleted successfully' }] };
          default:
            throw new Error(`Unknown operation: ${operation}`);
        }
      } catch (error) {
        const apiError = handleError(error);
        logger.error('manage_website failed:', apiError);
        throw new Error(formatErrorForMCP(apiError));
      }
    }
  );
}
