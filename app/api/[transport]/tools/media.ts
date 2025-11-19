import { z } from 'zod';
import { LitiumApiService } from '../../../../src/services/litium-api';
import { handleError, formatErrorForMCP } from '../../../../src/utils/error-handler';
import { logger } from '../../../../src/utils/logger';

export function registerMediaTools(server: any, getApiService: (req: Request) => LitiumApiService, req: Request) {
  server.tool(
    'manage_media',
    `Manage media files. Supported operations: search, get, upload, download, get_folder_files, get_subfolders

API Endpoints:
- search: POST /Litium/api/admin/media/files/search
- get: GET /Litium/api/admin/media/files/{systemId}
- upload: POST /Litium/api/admin/media/files/{systemId}/upload
- download: GET /Litium/api/admin/media/files/{systemId}/download
- get_folder_files: GET /Litium/api/admin/media/folders/{systemId}/files
- get_subfolders: GET /Litium/api/admin/media/folders/{systemId}/folders`,
    {
      operation: z.enum(['search', 'get', 'create', 'upload', 'download', 'get_folder_files', 'get_subfolders']),
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
            return { content: [{ type: 'text', text: JSON.stringify(await apiService.media.searchMediaFiles(params), null, 2) }] };
          case 'get':
            return { content: [{ type: 'text', text: JSON.stringify(await apiService.media.getMediaFile(systemId!), null, 2) }] };
          case 'create':
            return { content: [{ type: 'text', text: JSON.stringify(await apiService.media.createMediaFile(data), null, 2) }] };
          case 'upload':
            return { content: [{ type: 'text', text: JSON.stringify(await apiService.media.uploadFile(systemId!, data), null, 2) }] };
          case 'download':
            return { content: [{ type: 'text', text: JSON.stringify(await apiService.media.downloadFile(systemId!), null, 2) }] };
          case 'get_folder_files':
            return { content: [{ type: 'text', text: JSON.stringify(await apiService.media.getFilesInFolder(systemId!), null, 2) }] };
          case 'get_subfolders':
            return { content: [{ type: 'text', text: JSON.stringify(await apiService.media.getSubfolders(systemId!), null, 2) }] };
          default:
            throw new Error(`Unknown operation: ${operation}`);
        }
      } catch (error) {
        const apiError = handleError(error);
        logger.error('manage_media failed:', apiError);
        throw new Error(formatErrorForMCP(apiError));
      }
    }
  );
}
