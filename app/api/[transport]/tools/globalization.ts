import { z } from 'zod';
import { LitiumApiService } from '../../../../src/services/litium-api';
import { handleError, formatErrorForMCP } from '../../../../src/utils/error-handler';
import { logger } from '../../../../src/utils/logger';

export function registerGlobalizationTools(server: any, getApiService: (req: Request) => LitiumApiService, req: Request) {
  // Channel management
  server.tool(
    'manage_channel',
    `Manage globalization channels. Supported operations: search, get, create, update, delete`,
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
            return { content: [{ type: 'text', text: JSON.stringify(await apiService.globalization.searchChannels(params), null, 2) }] };
          case 'get':
            return { content: [{ type: 'text', text: JSON.stringify(await apiService.globalization.getChannel(systemId!), null, 2) }] };
          case 'create':
            return { content: [{ type: 'text', text: JSON.stringify(await apiService.globalization.createChannel(data), null, 2) }] };
          case 'update':
            return { content: [{ type: 'text', text: JSON.stringify(await apiService.globalization.updateChannel(systemId!, data), null, 2) }] };
          case 'delete':
            await apiService.globalization.deleteChannel(systemId!);
            return { content: [{ type: 'text', text: 'Channel deleted successfully' }] };
          default:
            throw new Error(`Unknown operation: ${operation}`);
        }
      } catch (error) {
        const apiError = handleError(error);
        logger.error('manage_channel failed:', apiError);
        throw new Error(formatErrorForMCP(apiError));
      }
    }
  );

  // Country management
  server.tool(
    'manage_country',
    `Manage countries. Supported operations: search, get, create, update, delete`,
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
            return { content: [{ type: 'text', text: JSON.stringify(await apiService.globalization.searchCountries(params), null, 2) }] };
          case 'get':
            return { content: [{ type: 'text', text: JSON.stringify(await apiService.globalization.getCountry(systemId!), null, 2) }] };
          case 'create':
            return { content: [{ type: 'text', text: JSON.stringify(await apiService.globalization.createCountry(data), null, 2) }] };
          case 'update':
            return { content: [{ type: 'text', text: JSON.stringify(await apiService.globalization.updateCountry(systemId!, data), null, 2) }] };
          case 'delete':
            await apiService.globalization.deleteCountry(systemId!);
            return { content: [{ type: 'text', text: 'Country deleted successfully' }] };
          default:
            throw new Error(`Unknown operation: ${operation}`);
        }
      } catch (error) {
        const apiError = handleError(error);
        logger.error('manage_country failed:', apiError);
        throw new Error(formatErrorForMCP(apiError));
      }
    }
  );

  // Currency management
  server.tool(
    'manage_currency',
    `Manage currencies. Supported operations: search, get, create, update, delete`,
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
            return { content: [{ type: 'text', text: JSON.stringify(await apiService.globalization.searchCurrencies(params), null, 2) }] };
          case 'get':
            return { content: [{ type: 'text', text: JSON.stringify(await apiService.globalization.getCurrency(systemId!), null, 2) }] };
          case 'create':
            return { content: [{ type: 'text', text: JSON.stringify(await apiService.globalization.createCurrency(data), null, 2) }] };
          case 'update':
            return { content: [{ type: 'text', text: JSON.stringify(await apiService.globalization.updateCurrency(systemId!, data), null, 2) }] };
          case 'delete':
            await apiService.globalization.deleteCurrency(systemId!);
            return { content: [{ type: 'text', text: 'Currency deleted successfully' }] };
          default:
            throw new Error(`Unknown operation: ${operation}`);
        }
      } catch (error) {
        const apiError = handleError(error);
        logger.error('manage_currency failed:', apiError);
        throw new Error(formatErrorForMCP(apiError));
      }
    }
  );

  // Language management
  server.tool(
    'manage_language',
    `Manage languages. Supported operations: search, get, create, update, delete`,
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
            return { content: [{ type: 'text', text: JSON.stringify(await apiService.globalization.searchLanguages(params), null, 2) }] };
          case 'get':
            return { content: [{ type: 'text', text: JSON.stringify(await apiService.globalization.getLanguage(systemId!), null, 2) }] };
          case 'create':
            return { content: [{ type: 'text', text: JSON.stringify(await apiService.globalization.createLanguage(data), null, 2) }] };
          case 'update':
            return { content: [{ type: 'text', text: JSON.stringify(await apiService.globalization.updateLanguage(systemId!, data), null, 2) }] };
          case 'delete':
            await apiService.globalization.deleteLanguage(systemId!);
            return { content: [{ type: 'text', text: 'Language deleted successfully' }] };
          default:
            throw new Error(`Unknown operation: ${operation}`);
        }
      } catch (error) {
        const apiError = handleError(error);
        logger.error('manage_language failed:', apiError);
        throw new Error(formatErrorForMCP(apiError));
      }
    }
  );

  // Market management
  server.tool(
    'manage_market',
    `Manage markets. Supported operations: search, get, create, update, delete`,
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
            return { content: [{ type: 'text', text: JSON.stringify(await apiService.globalization.searchMarkets(params), null, 2) }] };
          case 'get':
            return { content: [{ type: 'text', text: JSON.stringify(await apiService.globalization.getMarket(systemId!), null, 2) }] };
          case 'create':
            return { content: [{ type: 'text', text: JSON.stringify(await apiService.globalization.createMarket(data), null, 2) }] };
          case 'update':
            return { content: [{ type: 'text', text: JSON.stringify(await apiService.globalization.updateMarket(systemId!, data), null, 2) }] };
          case 'delete':
            await apiService.globalization.deleteMarket(systemId!);
            return { content: [{ type: 'text', text: 'Market deleted successfully' }] };
          default:
            throw new Error(`Unknown operation: ${operation}`);
        }
      } catch (error) {
        const apiError = handleError(error);
        logger.error('manage_market failed:', apiError);
        throw new Error(formatErrorForMCP(apiError));
      }
    }
  );
}
