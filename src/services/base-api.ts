import { TokenManager } from '../auth/token-manager';
import { type LitiumConfig } from '../types/config';

export abstract class BaseApiService {
  protected tokenManager: TokenManager;

  constructor(config: LitiumConfig) {
    this.tokenManager = new TokenManager(config);
  }

  /**
   * Generic search method for any endpoint
   */
  protected async search<T>(endpoint: string, params?: {
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

  /**
   * Generic POST search method for endpoints that use POST for search
   */
  protected async searchPost<T>(endpoint: string, params?: {
    search?: string;
    skip?: number;
    take?: number;
    sort?: string;
  }): Promise<T> {
    const searchData = {
      search: params?.search || '',
      skip: params?.skip || 0,
      take: params?.take || 20,
      sort: params?.sort || ''
    };

    return this.tokenManager.makeAuthenticatedRequest<T>('POST', endpoint, searchData);
  }

  /**
   * Generic GET method for retrieving a single item
   */
  protected async get<T>(endpoint: string): Promise<T> {
    return this.tokenManager.makeAuthenticatedRequest<T>('GET', endpoint);
  }

  /**
   * Generic POST method for creating items
   */
  protected async create<T>(endpoint: string, data: any): Promise<T> {
    return this.tokenManager.makeAuthenticatedRequest<T>('POST', endpoint, data);
  }

  /**
   * Generic PUT method for updating items
   */
  protected async update<T>(endpoint: string, data: any): Promise<T> {
    return this.tokenManager.makeAuthenticatedRequest<T>('PUT', endpoint, data);
  }

  /**
   * Generic DELETE method for deleting items
   */
  protected async delete(endpoint: string): Promise<void> {
    return this.tokenManager.makeAuthenticatedRequest<void>('DELETE', endpoint);
  }
}