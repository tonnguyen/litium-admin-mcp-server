import { z } from 'zod';
import { LitiumApiService } from '../../../../src/services/litium-api';
import { handleError, formatErrorForMCP } from '../../../../src/utils/error-handler';
import { logger } from '../../../../src/utils/logger';

export function registerContentTools(server: any, getApiService: (req: Request) => LitiumApiService, req: Request) {
  // Block management
  server.tool(
    'manage_block',
    `Manage content blocks. Supported operations: search, get, create, update, delete

API Endpoints:
- search: POST /Litium/api/admin/blocks/blocks/search
- get: GET /Litium/api/admin/blocks/blocks/{systemId}
- create: POST /Litium/api/admin/blocks/blocks
- update: PUT /Litium/api/admin/blocks/blocks/{systemId}
- delete: DELETE /Litium/api/admin/blocks/blocks/{systemId}`,
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
            return { content: [{ type: 'text', text: JSON.stringify(await apiService.blocks.searchBlocks(params), null, 2) }] };
          case 'get':
            return { content: [{ type: 'text', text: JSON.stringify(await apiService.blocks.getBlock(systemId!), null, 2) }] };
          case 'create':
            return { content: [{ type: 'text', text: JSON.stringify(await apiService.blocks.createBlock(data), null, 2) }] };
          case 'update':
            return { content: [{ type: 'text', text: JSON.stringify(await apiService.blocks.updateBlock(systemId!, data), null, 2) }] };
          case 'delete':
            await apiService.blocks.deleteBlock(systemId!);
            return { content: [{ type: 'text', text: 'Block deleted successfully' }] };
          default:
            throw new Error(`Unknown operation: ${operation}`);
        }
      } catch (error) {
        const apiError = handleError(error);
        logger.error('manage_block failed:', apiError);
        throw new Error(formatErrorForMCP(apiError));
      }
    }
  );

  // Page management
  server.tool(
    'manage_page',
    `Manage website pages. Supported operations: search, get, create, update, delete, unpublish, search_drafts, get_draft, create_draft, update_draft, delete_draft, publish_draft

API Endpoints (Published Pages):
- search: POST /Litium/api/admin/websites/pages/search
- get: GET /Litium/api/admin/websites/pages/{systemId}
- create: POST /Litium/api/admin/websites/pages
- update: PUT /Litium/api/admin/websites/pages/{systemId}
- delete: DELETE /Litium/api/admin/websites/pages/{systemId}
- unpublish: POST /Litium/api/admin/websites/pages/{systemId}/unpublish

API Endpoints (Draft Pages):
- search_drafts: GET /Litium/api/admin/websites/draftPages
- get_draft: GET /Litium/api/admin/websites/draftPages/{systemId}
- create_draft: POST /Litium/api/admin/websites/draftPages
- update_draft: PUT /Litium/api/admin/websites/draftPages/{systemId}
- delete_draft: DELETE /Litium/api/admin/websites/draftPages/{systemId}
- publish_draft: POST /Litium/api/admin/websites/draftPages/{systemId}/publish`,
    {
      operation: z.enum(['search', 'get', 'create', 'update', 'delete', 'unpublish', 
                         'search_drafts', 'get_draft', 'create_draft', 'update_draft', 'delete_draft', 'publish_draft']),
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
            return { content: [{ type: 'text', text: JSON.stringify(await apiService.websites.searchPages(params), null, 2) }] };
          case 'get':
            return { content: [{ type: 'text', text: JSON.stringify(await apiService.websites.getPage(systemId!), null, 2) }] };
          case 'create':
            return { content: [{ type: 'text', text: JSON.stringify(await apiService.websites.createPage(data), null, 2) }] };
          case 'update':
            return { content: [{ type: 'text', text: JSON.stringify(await apiService.websites.updatePage(systemId!, data), null, 2) }] };
          case 'delete':
            await apiService.websites.deletePage(systemId!);
            return { content: [{ type: 'text', text: 'Page deleted successfully' }] };
          case 'unpublish':
            await apiService.websites.unpublishPage(systemId!);
            return { content: [{ type: 'text', text: 'Page unpublished successfully' }] };
          case 'search_drafts':
            return { content: [{ type: 'text', text: JSON.stringify(await apiService.websites.getDraftPages(params), null, 2) }] };
          case 'get_draft':
            return { content: [{ type: 'text', text: JSON.stringify(await apiService.websites.getDraftPage(systemId!), null, 2) }] };
          case 'create_draft':
            return { content: [{ type: 'text', text: JSON.stringify(await apiService.websites.createDraftPage(data), null, 2) }] };
          case 'update_draft':
            return { content: [{ type: 'text', text: JSON.stringify(await apiService.websites.updateDraftPage(systemId!, data), null, 2) }] };
          case 'delete_draft':
            await apiService.websites.deleteDraftPage(systemId!);
            return { content: [{ type: 'text', text: 'Draft page deleted successfully' }] };
          case 'publish_draft':
            await apiService.websites.publishDraftPage(systemId!);
            return { content: [{ type: 'text', text: 'Draft page published successfully' }] };
          default:
            throw new Error(`Unknown operation: ${operation}`);
        }
      } catch (error) {
        const apiError = handleError(error);
        logger.error('manage_page failed:', apiError);
        throw new Error(formatErrorForMCP(apiError));
      }
    }
  );
}
