import { BaseApiService } from '../base-api';
import { type LitiumConfig } from '../../types/config';

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
}