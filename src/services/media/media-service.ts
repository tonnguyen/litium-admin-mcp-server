import { BaseApiService } from '../base-api';
import { type LitiumConfig } from '../../types/config';
import { FilterBuilder } from '../../utils/filter-builder';
import FormData from 'form-data';
import path from 'node:path';
import { createReadStream } from 'node:fs';
import { stat } from 'node:fs/promises';

export class MediaService extends BaseApiService {
  constructor(config: LitiumConfig) {
    super(config);
  }

  /**
   * Search for media files
   * Supports searching by file name or ID
   */
  async searchMediaFiles(params?: {
    search?: string;
    skip?: number;
    take?: number;
    sort?: string;
  }) {
    const endpoint = '/Litium/api/admin/media/files/search';
    const searchModel = FilterBuilder.buildMediaSearch(
      params?.search || '',
      params?.skip || 0,
      params?.take || 20
    );
    return this.searchPost<any>(endpoint, searchModel);
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
   * Supports searching by folder name or ID
   */
  async searchMediaFolders(params?: {
    search?: string;
    skip?: number;
    take?: number;
    sort?: string;
  }) {
    const endpoint = '/Litium/api/admin/media/folders/search';
    const searchModel = FilterBuilder.buildMediaSearch(
      params?.search || '',
      params?.skip || 0,
      params?.take || 20
    );
    return this.searchPost<any>(endpoint, searchModel);
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

  /**
   * Create a new field definition
   */
  async createFieldDefinition(fieldDefinition: any) {
    const endpoint = '/Litium/api/admin/media/fieldDefinitions';
    return this.create<any>(endpoint, fieldDefinition);
  }

  /**
   * Update an existing field definition
   */
  async updateFieldDefinition(systemId: string, fieldDefinition: any) {
    const endpoint = `/Litium/api/admin/media/fieldDefinitions/${systemId}`;
    return this.update<any>(endpoint, fieldDefinition);
  }

  /**
   * Delete a field definition
   */
  async deleteFieldDefinition(systemId: string) {
    const endpoint = `/Litium/api/admin/media/fieldDefinitions/${systemId}`;
    return this.delete(endpoint);
  }

  /**
   * Get a specific field definition by system ID
   */
  async getFieldDefinition(systemId: string) {
    const endpoint = `/Litium/api/admin/media/fieldDefinitions/${systemId}`;
    return this.get<any>(endpoint);
  }

  /**
   * Create a new field template
   */
  async createFieldTemplate(fieldTemplate: any) {
    const endpoint = '/Litium/api/admin/media/fieldTemplates';
    return this.create<any>(endpoint, fieldTemplate);
  }

  /**
   * Update an existing field template
   */
  async updateFieldTemplate(systemId: string, fieldTemplate: any) {
    const endpoint = `/Litium/api/admin/media/fieldTemplates/${systemId}`;
    return this.update<any>(endpoint, fieldTemplate);
  }

  /**
   * Delete a field template
   */
  async deleteFieldTemplate(systemId: string) {
    const endpoint = `/Litium/api/admin/media/fieldTemplates/${systemId}`;
    return this.delete(endpoint);
  }

  /**
   * Get a specific field template by system ID
   */
  async getFieldTemplate(systemId: string) {
    const endpoint = `/Litium/api/admin/media/fieldTemplates/${systemId}`;
    return this.get<any>(endpoint);
  }

  /**
   * Upload a file to a media file
   */
  async uploadFile(systemId: string, fileData: { filePath: string; fileName?: string; contentType?: string }) {
    if (!fileData?.filePath) {
      throw new Error('filePath is required to upload a media file');
    }

    const resolvedPath = path.isAbsolute(fileData.filePath)
      ? fileData.filePath
      : path.resolve(fileData.filePath);

    const fileStats = await stat(resolvedPath);
    if (!fileStats.isFile()) {
      throw new Error(`filePath must point to a file: ${resolvedPath}`);
    }

    const formData = new FormData();
    const fileName = fileData.fileName ?? path.basename(resolvedPath);
    const contentType = fileData.contentType ?? this.resolveMimeType(path.extname(fileName));

    formData.append('fileName', createReadStream(resolvedPath), {
      filename: fileName,
      contentType,
      knownLength: fileStats.size,
    });

    const headers = formData.getHeaders();
    const endpoint = `/Litium/api/admin/media/files/${systemId}/upload`;
    return this.tokenManager.makeAuthenticatedRequest<any>('PUT', endpoint, formData as any, {
      'Content-Type': headers['content-type'],
    });
  }

  private resolveMimeType(extension: string): string {
    const ext = extension.toLowerCase();
    const map: Record<string, string> = {
      '.png': 'image/png',
      '.jpg': 'image/jpeg',
      '.jpeg': 'image/jpeg',
      '.gif': 'image/gif',
      '.webp': 'image/webp',
      '.svg': 'image/svg+xml',
    };

    return map[ext] ?? 'application/octet-stream';
  }

  /**
   * Download a media file
   * Returns the redirect URL (Location header) from the download endpoint
   * The endpoint returns a 302 redirect to the actual file location
   * 
   * Based on adminapi-products-images-and-prices.md guide:
   * - The endpoint returns a 302 Found redirect
   * - The Location header contains the actual image URL
   * - This can be a local path or CDN URL
   */
  async downloadFile(systemId: string) {
    const endpoint = `/Litium/api/admin/media/files/${systemId}/download`;
    const url = await this.getRedirectUrl(endpoint);
    
    return {
      url,
      systemId,
      message: 'File download URL retrieved successfully'
    };
  }

  /**
   * Get files in a folder
   */
  async getFilesInFolder(systemId: string) {
    const endpoint = `/Litium/api/admin/media/folders/${systemId}/files`;
    return this.get<any>(endpoint);
  }

  /**
   * Get subfolders in a folder
   */
  async getSubfolders(systemId: string) {
    const endpoint = `/Litium/api/admin/media/folders/${systemId}/folders`;
    return this.get<any>(endpoint);
  }
}