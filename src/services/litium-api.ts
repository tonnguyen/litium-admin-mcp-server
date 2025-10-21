import { TokenManager } from '../auth/token-manager.js';
import { type LitiumConfig } from '../types/config.js';
import { type paths } from '../types/api.js';

export class LitiumApiService {
  private tokenManager: TokenManager;

  constructor(config: LitiumConfig) {
    this.tokenManager = new TokenManager(config);
  }

  // Blocks API
  async getBlocks(params?: {
    search?: string;
    skip?: number;
    take?: number;
    sort?: string;
  }) {
    const searchParams = new URLSearchParams();
    if (params?.search) searchParams.append('search', params.search);
    if (params?.skip) searchParams.append('skip', params.skip.toString());
    if (params?.take) searchParams.append('take', params.take.toString());
    if (params?.sort) searchParams.append('sort', params.sort);

    const url = `/Litium/api/admin/blocks/blocks/search${searchParams.toString() ? '?' + searchParams.toString() : ''}`;
    return this.tokenManager.makeAuthenticatedRequest<paths['/Litium/api/admin/blocks/blocks/search']['get']['responses']['200']['content']['application/json']>('GET', url);
  }

  async getBlock(systemId: string) {
    return this.tokenManager.makeAuthenticatedRequest<paths['/Litium/api/admin/blocks/blocks/{systemId}']['get']['responses']['200']['content']['application/json']>('GET', `/Litium/api/admin/blocks/blocks/${systemId}`);
  }

  async createBlock(block: paths['/Litium/api/admin/blocks/blocks']['post']['requestBody']['content']['application/json']) {
    return this.tokenManager.makeAuthenticatedRequest<paths['/Litium/api/admin/blocks/blocks']['post']['responses']['201']['content']['application/json']>('POST', '/Litium/api/admin/blocks/blocks', block);
  }

  async updateBlock(systemId: string, block: paths['/Litium/api/admin/blocks/blocks/{systemId}']['put']['requestBody']['content']['application/json']) {
    return this.tokenManager.makeAuthenticatedRequest<paths['/Litium/api/admin/blocks/blocks/{systemId}']['put']['responses']['200']['content']['application/json']>('PUT', `/Litium/api/admin/blocks/blocks/${systemId}`, block);
  }

  async deleteBlock(systemId: string) {
    return this.tokenManager.makeAuthenticatedRequest<void>('DELETE', `/Litium/api/admin/blocks/blocks/${systemId}`);
  }

  // Products API
  async getProducts(params?: {
    search?: string;
    skip?: number;
    take?: number;
    sort?: string;
  }) {
    const searchParams = new URLSearchParams();
    if (params?.search) searchParams.append('search', params.search);
    if (params?.skip) searchParams.append('skip', params.skip.toString());
    if (params?.take) searchParams.append('take', params.take.toString());
    if (params?.sort) searchParams.append('sort', params.sort);

    const url = `/Litium/api/admin/products/products/search${searchParams.toString() ? '?' + searchParams.toString() : ''}`;
    return this.tokenManager.makeAuthenticatedRequest<paths['/Litium/api/admin/products/products/search']['get']['responses']['200']['content']['application/json']>('GET', url);
  }

  async getProduct(systemId: string) {
    return this.tokenManager.makeAuthenticatedRequest<paths['/Litium/api/admin/products/products/{systemId}']['get']['responses']['200']['content']['application/json']>('GET', `/Litium/api/admin/products/products/${systemId}`);
  }

  async createProduct(product: paths['/Litium/api/admin/products/products']['post']['requestBody']['content']['application/json']) {
    return this.tokenManager.makeAuthenticatedRequest<paths['/Litium/api/admin/products/products']['post']['responses']['201']['content']['application/json']>('POST', '/Litium/api/admin/products/products', product);
  }

  async updateProduct(systemId: string, product: paths['/Litium/api/admin/products/products/{systemId}']['put']['requestBody']['content']['application/json']) {
    return this.tokenManager.makeAuthenticatedRequest<paths['/Litium/api/admin/products/products/{systemId}']['put']['responses']['200']['content']['application/json']>('PUT', `/Litium/api/admin/products/products/${systemId}`, product);
  }

  async deleteProduct(systemId: string) {
    return this.tokenManager.makeAuthenticatedRequest<void>('DELETE', `/Litium/api/admin/products/products/${systemId}`);
  }

  // Customers API
  async getCustomers(params?: {
    search?: string;
    skip?: number;
    take?: number;
    sort?: string;
  }) {
    const searchParams = new URLSearchParams();
    if (params?.search) searchParams.append('search', params.search);
    if (params?.skip) searchParams.append('skip', params.skip.toString());
    if (params?.take) searchParams.append('take', params.take.toString());
    if (params?.sort) searchParams.append('sort', params.sort);

    const url = `/Litium/api/admin/customers/people/search${searchParams.toString() ? '?' + searchParams.toString() : ''}`;
    return this.tokenManager.makeAuthenticatedRequest<paths['/Litium/api/admin/customers/people/search']['get']['responses']['200']['content']['application/json']>('GET', url);
  }

  async getCustomer(systemId: string) {
    return this.tokenManager.makeAuthenticatedRequest<paths['/Litium/api/admin/customers/people/{systemId}']['get']['responses']['200']['content']['application/json']>('GET', `/Litium/api/admin/customers/people/${systemId}`);
  }

  async createCustomer(customer: paths['/Litium/api/admin/customers/people']['post']['requestBody']['content']['application/json']) {
    return this.tokenManager.makeAuthenticatedRequest<paths['/Litium/api/admin/customers/people']['post']['responses']['201']['content']['application/json']>('POST', '/Litium/api/admin/customers/people', customer);
  }

  async updateCustomer(systemId: string, customer: paths['/Litium/api/admin/customers/people/{systemId}']['put']['requestBody']['content']['application/json']) {
    return this.tokenManager.makeAuthenticatedRequest<paths['/Litium/api/admin/customers/people/{systemId}']['put']['responses']['200']['content']['application/json']>('PUT', `/Litium/api/admin/customers/people/${systemId}`, customer);
  }

  async deleteCustomer(systemId: string) {
    return this.tokenManager.makeAuthenticatedRequest<void>('DELETE', `/Litium/api/admin/customers/people/${systemId}`);
  }

  // Media API
  async getMediaFiles(params?: {
    search?: string;
    skip?: number;
    take?: number;
    sort?: string;
  }) {
    const searchParams = new URLSearchParams();
    if (params?.search) searchParams.append('search', params.search);
    if (params?.skip) searchParams.append('skip', params.skip.toString());
    if (params?.take) searchParams.append('take', params.take.toString());
    if (params?.sort) searchParams.append('sort', params.sort);

    const url = `/Litium/api/admin/media/files/search${searchParams.toString() ? '?' + searchParams.toString() : ''}`;
    return this.tokenManager.makeAuthenticatedRequest<paths['/Litium/api/admin/media/files/search']['get']['responses']['200']['content']['application/json']>('GET', url);
  }

  async getMediaFile(systemId: string) {
    return this.tokenManager.makeAuthenticatedRequest<paths['/Litium/api/admin/media/files/{systemId}']['get']['responses']['200']['content']['application/json']>('GET', `/Litium/api/admin/media/files/${systemId}`);
  }

  // Websites API
  async getWebsites() {
    return this.tokenManager.makeAuthenticatedRequest<paths['/Litium/api/admin/websites/websites']['get']['responses']['200']['content']['application/json']>('GET', '/Litium/api/admin/websites/websites');
  }

  async getWebsite(systemId: string) {
    return this.tokenManager.makeAuthenticatedRequest<paths['/Litium/api/admin/websites/websites/{systemId}']['get']['responses']['200']['content']['application/json']>('GET', `/Litium/api/admin/websites/websites/${systemId}`);
  }

  // Sales API - Orders
  async getOrders(params?: {
    search?: string;
    skip?: number;
    take?: number;
    sort?: string;
  }) {
    const searchParams = new URLSearchParams();
    if (params?.search) searchParams.append('search', params.search);
    if (params?.skip) searchParams.append('skip', params.skip.toString());
    if (params?.take) searchParams.append('take', params.take.toString());
    if (params?.sort) searchParams.append('sort', params.sort);

    const url = `/Litium/api/admin/sales/orders/search${searchParams.toString() ? '?' + searchParams.toString() : ''}`;
    return this.tokenManager.makeAuthenticatedRequest<paths['/Litium/api/admin/sales/orders/search']['get']['responses']['200']['content']['application/json']>('GET', url);
  }

  async getOrder(systemId: string) {
    return this.tokenManager.makeAuthenticatedRequest<paths['/Litium/api/admin/sales/orders/{systemId}']['get']['responses']['200']['content']['application/json']>('GET', `/Litium/api/admin/sales/orders/${systemId}`);
  }

  // Generic search method for any endpoint
  async search<T>(endpoint: string, params?: {
    search?: string;
    skip?: number;
    take?: number;
    sort?: string;
  }): Promise<T> {
    const searchParams = new URLSearchParams();
    if (params?.search) searchParams.append('search', params.search);
    if (params?.skip) searchParams.append('skip', params.skip.toString());
    if (params?.take) searchParams.append('take', params.take.toString());
    if (params?.sort) searchParams.append('sort', params.sort);

    const url = `${endpoint}${searchParams.toString() ? '?' + searchParams.toString() : ''}`;
    return this.tokenManager.makeAuthenticatedRequest<T>('GET', url);
  }
}