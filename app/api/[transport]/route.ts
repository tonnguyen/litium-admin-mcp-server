import { createMcpHandler } from 'mcp-handler';
import { LitiumApiService } from '../../../src/services/litium-api';
import { createLitiumConfig } from '../../../src/utils/config';
import { handleError, formatErrorForMCP } from '../../../src/utils/error-handler';
import { logger } from '../../../src/utils/logger';
import { registerAllTools } from './tools';

// Helper function to extract Litium credentials from request headers
function getLitiumConfigFromHeaders(request: Request): { baseUrl: string; clientId: string; clientSecret: string } | null {
  const baseUrl = request.headers.get('X-Litium-Base-Url');
  const clientId = request.headers.get('X-Litium-Client-Id');
  const clientSecret = request.headers.get('X-Litium-Client-Secret');

  if (!baseUrl || !clientId || !clientSecret) {
    return null;
  }

  return { baseUrl, clientId, clientSecret };
}

// Helper function to get API service instance from request
function getApiService(request: Request): LitiumApiService {
  const credentials = getLitiumConfigFromHeaders(request);
  
  if (!credentials) {
    throw new Error('Missing Litium credentials. Please configure X-Litium-Base-Url, X-Litium-Client-Id, and X-Litium-Client-Secret headers in your MCP client configuration.');
  }

  try {
    const config = createLitiumConfig(credentials);
    return new LitiumApiService(config);
  } catch (error) {
    const apiError = handleError(error);
    logger.error('Failed to initialize Litium API service:', apiError);
    throw new Error(`Configuration failed: ${formatErrorForMCP(apiError)}`);
  }
}

// Create MCP handler using Next.js request
const handler = async (req: Request) => {
  return createMcpHandler(
    (server) => {
      // Register all domain tools
      registerAllTools(server, getApiService, req);
    },
    {
      serverInfo: {
        name: 'Litium Admin MCP Server',
        version: '2.0.0',
      },
    },
    {
      basePath: '/api',
      verboseLogs: true,
      maxDuration: 60,
    }
  )(req);
};

export { handler as GET, handler as POST, handler as DELETE };

