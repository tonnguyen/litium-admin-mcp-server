import axios from 'axios';
import { TokenManager } from '../auth/token-manager';
import { type LitiumConfig } from '../types/config';
import { type SearchModel } from '../utils/filter-builder';

export abstract class BaseApiService {
  protected tokenManager: TokenManager;

  constructor(config: LitiumConfig) {
    this.tokenManager = new TokenManager(config);
  }

  /**
   * Generic search method for any endpoint (GET)
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
   * Generic POST search method using Litium's SearchModel
   * Accepts a pre-built SearchModel with filter conditions
   */
  protected async searchPost<T>(endpoint: string, searchModel: SearchModel): Promise<T> {
    return this.tokenManager.makeAuthenticatedRequest<T>('POST', endpoint, searchModel);
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

  /**
   * Get redirect URL from an endpoint that returns a 302/301 redirect
   * Useful for download endpoints that redirect to actual file locations
   */
  protected async getRedirectUrl(endpoint: string): Promise<string> {
    const token = await this.tokenManager.getValidToken();
    const fullUrl = endpoint.startsWith('http') 
      ? endpoint 
      : `${this.tokenManager.getBaseUrl()}${endpoint}`;

    try {
      const response = await axios({
        method: 'GET',
        url: fullUrl,
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        maxRedirects: 0,
        validateStatus: (status: number) => status === 302 || status === 301 || status === 307 || status === 308
      });

      return response.headers.location || response.headers.Location;
    } catch (error: any) {
      if (error.response?.status === 404) {
        throw new Error(`Resource not found at ${endpoint}`);
      }
      if (error.response?.status === 401) {
        throw new Error('Unauthorized access');
      }
      throw error;
    }
  }
}