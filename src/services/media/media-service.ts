import { BaseApiService } from '../base-api.js';
import { type LitiumConfig } from '../../types/config.js';

export class MediaService extends BaseApiService {
  constructor(config: LitiumConfig) {
    super(config);
  }

  /**
   * Search for media files
   */
  async searchMediaFiles(params?: {
    search?: string;
    skip?: number;
    take?: number;
    sort?: string;
  }) {
    const endpoint = '/Litium/api/admin/media/files/search';
    return this.search<any>(endpoint, params);
  }

  /**
   * Get a specific media file by system ID
   */
  async getMediaFile(systemId: string) {
    const endpoint = `/Litium/api/admin/media/files/${systemId}`;
    return this.get<any>(endpoint);
  }

  /**
   * Create a new media file
   */
  async createMediaFile(file: any) {
    const endpoint = '/Litium/api/admin/media/files';
    return this.create<any>(endpoint, file);
  }

  /**
   * Update an existing media file
   */
  async updateMediaFile(systemId: string, file: any) {
    const endpoint = `/Litium/api/admin/media/files/${systemId}`;
    return this.update<any>(endpoint, file);
  }

  /**
   * Delete a media file
   */
  async deleteMediaFile(systemId: string) {
    const endpoint = `/Litium/api/admin/media/files/${systemId}`;
    return this.delete(endpoint);
  }

  /**
   * Search for media folders
   */
  async searchMediaFolders(params?: {
    search?: string;
    skip?: number;
    take?: number;
    sort?: string;
  }) {
    const endpoint = '/Litium/api/admin/media/folders';
    return this.search<any>(endpoint, params);
  }

  /**
   * Get a specific media folder
   */
  async getMediaFolder(systemId: string) {
    const endpoint = `/Litium/api/admin/media/folders/${systemId}`;
    return this.get<any>(endpoint);
  }

  /**
   * Create a new media folder
   */
  async createMediaFolder(folder: any) {
    const endpoint = '/Litium/api/admin/media/folders';
    return this.create<any>(endpoint, folder);
  }

  /**
   * Update an existing media folder
   */
  async updateMediaFolder(systemId: string, folder: any) {
    const endpoint = `/Litium/api/admin/media/folders/${systemId}`;
    return this.update<any>(endpoint, folder);
  }

  /**
   * Delete a media folder
   */
  async deleteMediaFolder(systemId: string) {
    const endpoint = `/Litium/api/admin/media/folders/${systemId}`;
    return this.delete(endpoint);
  }

  /**
   * Get media file types
   */
  async getMediaFileTypes(params?: {
    search?: string;
    skip?: number;
    take?: number;
    sort?: string;
  }) {
    const endpoint = '/Litium/api/admin/media/fileTypes';
    return this.search<any>(endpoint, params);
  }

  /**
   * Get a specific media file type
   */
  async getMediaFileType(systemId: string) {
    const endpoint = `/Litium/api/admin/media/fileTypes/${systemId}`;
    return this.get<any>(endpoint);
  }

  /**
   * Get media field definitions
   */
  async getFieldDefinitions(params?: {
    search?: string;
    skip?: number;
    take?: number;
    sort?: string;
  }) {
    const endpoint = '/Litium/api/admin/media/fieldDefinitions';
    return this.search<any>(endpoint, params);
  }

  /**
   * Get media field templates
   */
  async getFieldTemplates(params?: {
    search?: string;
    skip?: number;
    take?: number;
    sort?: string;
  }) {
    const endpoint = '/Litium/api/admin/media/fieldTemplates';
    return this.search<any>(endpoint, params);
  }
}