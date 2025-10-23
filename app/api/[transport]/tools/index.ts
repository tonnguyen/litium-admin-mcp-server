import { LitiumApiService } from '../../../../src/services/litium-api';
import { registerProductTools } from './products';
import { registerContentTools } from './content';
import { registerMediaTools } from './media';
import { registerWebsiteTools } from './websites';
import { registerCustomerTools } from './customers';
import { registerSalesTools } from './sales';
import { registerGlobalizationTools } from './globalization';
import { registerApiInfoTools } from './api-info';

export function registerAllTools(server: any, getApiService: (req: Request) => LitiumApiService, req: Request) {
  registerProductTools(server, getApiService, req);
  registerContentTools(server, getApiService, req);
  registerMediaTools(server, getApiService, req);
  registerWebsiteTools(server, getApiService, req);
  registerCustomerTools(server, getApiService, req);
  registerSalesTools(server, getApiService, req);
  registerGlobalizationTools(server, getApiService, req);
  registerApiInfoTools(server, getApiService, req);
}

