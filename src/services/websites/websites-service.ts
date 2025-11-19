import { BaseApiService } from '../base-api';
import { type LitiumConfig } from '../../types/config';
import { FilterBuilder } from '../../utils/filter-builder';
import { mergeFieldValues, sanitizeFields } from '../../utils/field-merger';

export class WebsitesService extends BaseApiService {
  constructor(config: LitiumConfig) {
    super(config);
  }

  /**
   * Get all websites
   */
  async getWebsites() {
    const endpoint = '/Litium/api/admin/websites/websites';
    return this.get<any>(endpoint);
  }

  /**
   * Get a specific website by system ID
   */
  async getWebsite(systemId: string) {
    const endpoint = `/Litium/api/admin/websites/websites/${systemId}`;
    return this.get<any>(endpoint);
  }

  /**
   * Create a new website
   */
  async createWebsite(website: any) {
    const endpoint = '/Litium/api/admin/websites/websites';
    return this.create<any>(endpoint, website);
  }

  /**
   * Update an existing website
   */
  async updateWebsite(systemId: string, website: any) {
    const endpoint = `/Litium/api/admin/websites/websites/${systemId}`;
    return this.update<any>(endpoint, website);
  }

  /**
   * Delete a website
   */
  async deleteWebsite(systemId: string) {
    const endpoint = `/Litium/api/admin/websites/websites/${systemId}`;
    return this.delete(endpoint);
  }

  /**
   * Get website groups
   */
  async getWebsiteGroups(params?: {
    search?: string;
    skip?: number;
    take?: number;
    sort?: string;
  }) {
    const endpoint = '/Litium/api/admin/websites/websiteGroups';
    return this.search<any>(endpoint, params);
  }

  /**
   * Get a specific website group
   */
  async getWebsiteGroup(systemId: string) {
    const endpoint = `/Litium/api/admin/websites/websiteGroups/${systemId}`;
    return this.get<any>(endpoint);
  }

  /**
   * Create a new website group
   */
  async createWebsiteGroup(group: any) {
    const endpoint = '/Litium/api/admin/websites/websiteGroups';
    return this.create<any>(endpoint, group);
  }

  /**
   * Update an existing website group
   */
  async updateWebsiteGroup(systemId: string, group: any) {
    const endpoint = `/Litium/api/admin/websites/websiteGroups/${systemId}`;
    return this.update<any>(endpoint, group);
  }

  /**
   * Delete a website group
   */
  async deleteWebsiteGroup(systemId: string) {
    const endpoint = `/Litium/api/admin/websites/websiteGroups/${systemId}`;
    return this.delete(endpoint);
  }

  /**
   * Get website field definitions
   */
  async getFieldDefinitions(params?: {
    search?: string;
    skip?: number;
    take?: number;
    sort?: string;
  }) {
    const endpoint = '/Litium/api/admin/websites/fieldDefinitions';
    return this.search<any>(endpoint, params);
  }

  /**
   * Get website field templates
   */
  async getFieldTemplates(params?: {
    search?: string;
    skip?: number;
    take?: number;
    sort?: string;
  }) {
    const endpoint = '/Litium/api/admin/websites/fieldTemplates';
    return this.search<any>(endpoint, params);
  }

  /**
   * Create a new field definition
   */
  async createFieldDefinition(fieldDefinition: any) {
    const endpoint = '/Litium/api/admin/websites/fieldDefinitions';
    return this.create<any>(endpoint, fieldDefinition);
  }

  /**
   * Update an existing field definition
   */
  async updateFieldDefinition(systemId: string, fieldDefinition: any) {
    const endpoint = `/Litium/api/admin/websites/fieldDefinitions/${systemId}`;
    return this.update<any>(endpoint, fieldDefinition);
  }

  /**
   * Delete a field definition
   */
  async deleteFieldDefinition(systemId: string) {
    const endpoint = `/Litium/api/admin/websites/fieldDefinitions/${systemId}`;
    return this.delete(endpoint);
  }

  /**
   * Get a specific field definition by system ID
   */
  async getFieldDefinition(systemId: string) {
    const endpoint = `/Litium/api/admin/websites/fieldDefinitions/${systemId}`;
    return this.get<any>(endpoint);
  }

  /**
   * Create a new field template
   */
  async createFieldTemplate(fieldTemplate: any) {
    const endpoint = '/Litium/api/admin/websites/fieldTemplates';
    return this.create<any>(endpoint, fieldTemplate);
  }

  /**
   * Update an existing field template
   */
  async updateFieldTemplate(systemId: string, fieldTemplate: any) {
    const endpoint = `/Litium/api/admin/websites/fieldTemplates/${systemId}`;
    return this.update<any>(endpoint, fieldTemplate);
  }

  /**
   * Delete a field template
   */
  async deleteFieldTemplate(systemId: string) {
    const endpoint = `/Litium/api/admin/websites/fieldTemplates/${systemId}`;
    return this.delete(endpoint);
  }

  /**
   * Get a specific field template by system ID
   */
  async getFieldTemplate(systemId: string) {
    const endpoint = `/Litium/api/admin/websites/fieldTemplates/${systemId}`;
    return this.get<any>(endpoint);
  }

  // ==================== Pages ====================

  /**
   * Search for pages
   * Supports searching by page ID or title
   */
  async searchPages(params?: {
    search?: string;
    skip?: number;
    take?: number;
    sort?: string;
  }) {
    const endpoint = '/Litium/api/admin/websites/pages/search';
    const searchModel = FilterBuilder.buildPageSearch(
      params?.search || '',
      params?.skip || 0,
      params?.take || 20
    );
    return this.searchPost<any>(endpoint, searchModel);
  }

  /**
   * Get a specific page by system ID
   */
  async getPage(systemId: string) {
    const endpoint = `/Litium/api/admin/websites/pages/${systemId}`;
    return this.get<any>(endpoint);
  }

  /**
   * Create a new page
   */
  async createPage(page: any) {
    const endpoint = '/Litium/api/admin/websites/pages';
    return this.create<any>(endpoint, page);
  }

  /**
   * Update an existing page
   */
  async updatePage(systemId: string, page: any) {
    const endpoint = `/Litium/api/admin/websites/pages/${systemId}`;
    const existing = await this.getPage(systemId);
    const mergedFields = mergeFieldValues(
      sanitizeFields(existing.fields, ['_lastWriteTimeUtc']),
      sanitizeFields(page?.fields)
    );

    const payload = {
      ...existing,
      ...page,
      fields: mergedFields,
      blocks: page?.blocks !== undefined ? page.blocks : existing.blocks,
      channelLinks: page?.channelLinks !== undefined ? page.channelLinks : existing.channelLinks,
      accessControlList:
        page?.accessControlList !== undefined ? page.accessControlList : existing.accessControlList,
    };

    return this.update<any>(endpoint, payload);
  }

  /**
   * Delete a page
   */
  async deletePage(systemId: string) {
    const endpoint = `/Litium/api/admin/websites/pages/${systemId}`;
    return this.delete(endpoint);
  }

  /**
   * Clear page cache
   */
  async clearPageCache(systemId: string) {
    const endpoint = `/Litium/api/admin/websites/pages/${systemId}/cache`;
    return this.tokenManager.makeAuthenticatedRequest<any>('DELETE', endpoint);
  }

  /**
   * Set time to unpublish a page
   */
  async setPageTimeUnpublish(systemId: string, timeUnpublish: any) {
    const endpoint = `/Litium/api/admin/websites/pages/${systemId}/timeUnpublish`;
    return this.tokenManager.makeAuthenticatedRequest<any>('PUT', endpoint, timeUnpublish);
  }

  /**
   * Unpublish a page
   */
  async unpublishPage(systemId: string) {
    const endpoint = `/Litium/api/admin/websites/pages/${systemId}/unpublish`;
    return this.tokenManager.makeAuthenticatedRequest<any>('POST', endpoint);
  }

  /**
   * Get page key lookups
   */
  async getPageKeyLookups(params?: { keys?: string[] }) {
    const endpoint = '/Litium/api/admin/websites/pages/keyLookups';
    return this.tokenManager.makeAuthenticatedRequest<any>('POST', endpoint, params);
  }

  // ==================== Draft Pages ====================

  /**
   * Get draft pages
   */
  async getDraftPages(params?: {
    search?: string;
    skip?: number;
    take?: number;
    sort?: string;
  }) {
    const endpoint = '/Litium/api/admin/websites/draftPages';
    return this.search<any>(endpoint, params);
  }

  /**
   * Get a specific draft page by system ID
   */
  async getDraftPage(systemId: string) {
    const endpoint = `/Litium/api/admin/websites/draftPages/${systemId}`;
    return this.get<any>(endpoint);
  }

  /**
   * Create a new draft page
   */
  async createDraftPage(page: any) {
    const endpoint = '/Litium/api/admin/websites/draftPages';
    return this.create<any>(endpoint, page);
  }

  /**
   * Update an existing draft page
   */
  async updateDraftPage(systemId: string, page: any) {
    const endpoint = `/Litium/api/admin/websites/draftPages/${systemId}`;
    return this.update<any>(endpoint, page);
  }

  /**
   * Delete a draft page
   */
  async deleteDraftPage(systemId: string) {
    const endpoint = `/Litium/api/admin/websites/draftPages/${systemId}`;
    return this.delete(endpoint);
  }

  /**
   * Publish a draft page
   */
  async publishDraftPage(systemId: string) {
    const endpoint = `/Litium/api/admin/websites/draftPages/${systemId}/publish`;
    return this.tokenManager.makeAuthenticatedRequest<any>('POST', endpoint);
  }

  /**
   * Set time to publish a draft page
   */
  async setDraftPageTimePublish(systemId: string, timePublish: any) {
    const endpoint = `/Litium/api/admin/websites/draftPages/${systemId}/timePublish`;
    return this.tokenManager.makeAuthenticatedRequest<any>('PUT', endpoint, timePublish);
  }

  // ==================== URL Redirects ====================

  /**
   * Search for URL redirects
   * Supports searching by redirect ID or URL
   */
  async searchUrlRedirects(params?: {
    search?: string;
    skip?: number;
    take?: number;
    sort?: string;
  }) {
    const endpoint = '/Litium/api/admin/websites/urlRedirects/search';
    const searchModel = FilterBuilder.buildGenericSearch(
      params?.search || '',
      params?.skip || 0,
      params?.take || 20
    );
    return this.searchPost<any>(endpoint, searchModel);
  }

  /**
   * Get a specific URL redirect by system ID
   */
  async getUrlRedirect(systemId: string) {
    const endpoint = `/Litium/api/admin/websites/urlRedirects/${systemId}`;
    return this.get<any>(endpoint);
  }

  /**
   * Create a new URL redirect
   */
  async createUrlRedirect(urlRedirect: any) {
    const endpoint = '/Litium/api/admin/websites/urlRedirects';
    return this.create<any>(endpoint, urlRedirect);
  }

  /**
   * Update an existing URL redirect
   */
  async updateUrlRedirect(systemId: string, urlRedirect: any) {
    const endpoint = `/Litium/api/admin/websites/urlRedirects/${systemId}`;
    return this.update<any>(endpoint, urlRedirect);
  }

  /**
   * Delete a URL redirect
   */
  async deleteUrlRedirect(systemId: string) {
    const endpoint = `/Litium/api/admin/websites/urlRedirects/${systemId}`;
    return this.delete(endpoint);
  }
}