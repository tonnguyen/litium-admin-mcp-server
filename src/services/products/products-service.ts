import { BaseApiService } from '../base-api';
import { type LitiumConfig } from '../../types/config';

export class ProductsService extends BaseApiService {
  constructor(config: LitiumConfig) {
    super(config);
  }

  /**
   * Search for base products
   */
  async searchBaseProducts(params?: {
    search?: string;
    skip?: number;
    take?: number;
    sort?: string;
  }) {
    const endpoint = '/Litium/api/admin/products/baseProducts/search';
    return this.searchPost<any>(endpoint, params);
  }

  /**
   * Get a specific base product by system ID
   */
  async getBaseProduct(systemId: string) {
    const endpoint = `/Litium/api/admin/products/baseProducts/${systemId}`;
    return this.get<any>(endpoint);
  }

  /**
   * Create a new base product
   */
  async createBaseProduct(product: any) {
    const endpoint = '/Litium/api/admin/products/baseProducts';
    return this.create<any>(endpoint, product);
  }

  /**
   * Update an existing base product
   */
  async updateBaseProduct(systemId: string, product: any) {
    const endpoint = `/Litium/api/admin/products/baseProducts/${systemId}`;
    return this.update<any>(endpoint, product);
  }

  /**
   * Delete a base product
   */
  async deleteBaseProduct(systemId: string) {
    const endpoint = `/Litium/api/admin/products/baseProducts/${systemId}`;
    return this.delete(endpoint);
  }

  /**
   * Get product variants for a base product
   */
  async getProductVariants(systemId: string) {
    const endpoint = `/Litium/api/admin/products/baseProducts/${systemId}/variants`;
    return this.get<any>(endpoint);
  }

  /**
   * Search for assortments
   */
  async searchAssortments(params?: {
    search?: string;
    skip?: number;
    take?: number;
    sort?: string;
  }) {
    const endpoint = '/Litium/api/admin/products/assortments';
    return this.search<any>(endpoint, params);
  }

  /**
   * Get a specific assortment
   */
  async getAssortment(systemId: string) {
    const endpoint = `/Litium/api/admin/products/assortments/${systemId}`;
    return this.get<any>(endpoint);
  }

  /**
   * Create a new assortment
   */
  async createAssortment(assortment: any) {
    const endpoint = '/Litium/api/admin/products/assortments';
    return this.create<any>(endpoint, assortment);
  }

  /**
   * Update an existing assortment
   */
  async updateAssortment(systemId: string, assortment: any) {
    const endpoint = `/Litium/api/admin/products/assortments/${systemId}`;
    return this.update<any>(endpoint, assortment);
  }

  /**
   * Delete an assortment
   */
  async deleteAssortment(systemId: string) {
    const endpoint = `/Litium/api/admin/products/assortments/${systemId}`;
    return this.delete(endpoint);
  }

  /**
   * Get categories for an assortment
   */
  async getAssortmentCategories(systemId: string) {
    const endpoint = `/Litium/api/admin/products/assortments/${systemId}/categories`;
    return this.get<any>(endpoint);
  }

  /**
   * Search for product categories
   */
  async searchCategories(params?: {
    search?: string;
    skip?: number;
    take?: number;
    sort?: string;
  }) {
    const endpoint = '/Litium/api/admin/products/categories';
    return this.search<any>(endpoint, params);
  }

  /**
   * Get a specific product category
   */
  async getCategory(systemId: string) {
    const endpoint = `/Litium/api/admin/products/categories/${systemId}`;
    return this.get<any>(endpoint);
  }

  /**
   * Create a new product category
   */
  async createCategory(category: any) {
    const endpoint = '/Litium/api/admin/products/categories';
    return this.create<any>(endpoint, category);
  }

  /**
   * Update an existing product category
   */
  async updateCategory(systemId: string, category: any) {
    const endpoint = `/Litium/api/admin/products/categories/${systemId}`;
    return this.update<any>(endpoint, category);
  }

  /**
   * Delete a product category
   */
  async deleteCategory(systemId: string) {
    const endpoint = `/Litium/api/admin/products/categories/${systemId}`;
    return this.delete(endpoint);
  }
}