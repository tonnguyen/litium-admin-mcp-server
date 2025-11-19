import { BaseApiService } from '../base-api';
import { type LitiumConfig } from '../../types/config';
import { FilterBuilder } from '../../utils/filter-builder';
import { mergeFieldValues, sanitizeFields } from '../../utils/field-merger';

export class BlocksService extends BaseApiService {
  constructor(config: LitiumConfig) {
    super(config);
  }

  /**
   * Search for content blocks
   * Supports searching by block ID or name
   */
  async searchBlocks(params?: {
    search?: string;
    skip?: number;
    take?: number;
    sort?: string;
  }) {
    const endpoint = '/Litium/api/admin/blocks/blocks/search';
    const searchModel = FilterBuilder.buildBlockSearch(
      params?.search || '',
      params?.skip || 0,
      params?.take || 20
    );
    return this.searchPost<any>(endpoint, searchModel);
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
    const existing = await this.getBlock(systemId);
    const mergedFields = mergeFieldValues(
      sanitizeFields(existing.fields, ['_lastWriteTimeUtc']),
      sanitizeFields(block?.fields)
    );

    const payload = {
      ...existing,
      ...block,
      fields: mergedFields,
      channelLinks: block?.channelLinks !== undefined ? block.channelLinks : existing.channelLinks,
      accessControlList:
        block?.accessControlList !== undefined ? block.accessControlList : existing.accessControlList,
      items: block?.items !== undefined ? block.items : existing.items,
      blocks: block?.blocks !== undefined ? block.blocks : existing.blocks,
    };

    return this.update<any>(endpoint, payload);
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