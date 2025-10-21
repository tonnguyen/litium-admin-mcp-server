import { BaseApiService } from '../base-api.js';
import { type LitiumConfig } from '../../types/config.js';

export class BlocksService extends BaseApiService {
  constructor(config: LitiumConfig) {
    super(config);
  }

  /**
   * Search for content blocks
   */
  async searchBlocks(params?: {
    search?: string;
    skip?: number;
    take?: number;
    sort?: string;
  }) {
    const endpoint = '/Litium/api/admin/blocks/blocks/search';
    return this.search<any>(endpoint, params);
  }

  /**
   * Get a specific block by system ID
   */
  async getBlock(systemId: string) {
    const endpoint = `/Litium/api/admin/blocks/blocks/${systemId}`;
    return this.get<any>(endpoint);
  }

  /**
   * Create a new content block
   */
  async createBlock(block: any) {
    const endpoint = '/Litium/api/admin/blocks/blocks';
    return this.create<any>(endpoint, block);
  }

  /**
   * Update an existing content block
   */
  async updateBlock(systemId: string, block: any) {
    const endpoint = `/Litium/api/admin/blocks/blocks/${systemId}`;
    return this.update<any>(endpoint, block);
  }

  /**
   * Delete a content block
   */
  async deleteBlock(systemId: string) {
    const endpoint = `/Litium/api/admin/blocks/blocks/${systemId}`;
    return this.delete(endpoint);
  }

  /**
   * Get block categories
   */
  async getCategories(params?: {
    search?: string;
    skip?: number;
    take?: number;
    sort?: string;
  }) {
    const endpoint = '/Litium/api/admin/blocks/categories';
    return this.search<any>(endpoint, params);
  }

  /**
   * Get a specific block category
   */
  async getCategory(systemId: string) {
    const endpoint = `/Litium/api/admin/blocks/categories/${systemId}`;
    return this.get<any>(endpoint);
  }

  /**
   * Get draft blocks
   */
  async getDraftBlocks(params?: {
    search?: string;
    skip?: number;
    take?: number;
    sort?: string;
  }) {
    const endpoint = '/Litium/api/admin/blocks/draftBlocks';
    return this.search<any>(endpoint, params);
  }

  /**
   * Get a specific draft block
   */
  async getDraftBlock(systemId: string) {
    const endpoint = `/Litium/api/admin/blocks/draftBlocks/${systemId}`;
    return this.get<any>(endpoint);
  }

  /**
   * Publish a draft block
   */
  async publishDraftBlock(systemId: string) {
    const endpoint = `/Litium/api/admin/blocks/draftBlocks/${systemId}/publish`;
    return this.tokenManager.makeAuthenticatedRequest<any>('POST', endpoint);
  }

  /**
   * Get field definitions for blocks
   */
  async getFieldDefinitions(params?: {
    search?: string;
    skip?: number;
    take?: number;
    sort?: string;
  }) {
    const endpoint = '/Litium/api/admin/blocks/fieldDefinitions';
    return this.search<any>(endpoint, params);
  }

  /**
   * Get field templates for blocks
   */
  async getFieldTemplates(params?: {
    search?: string;
    skip?: number;
    take?: number;
    sort?: string;
  }) {
    const endpoint = '/Litium/api/admin/blocks/fieldTemplates';
    return this.search<any>(endpoint, params);
  }
}