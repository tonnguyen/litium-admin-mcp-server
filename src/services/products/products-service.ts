import { BaseApiService } from '../base-api';
import { type LitiumConfig } from '../../types/config';
import { FilterBuilder } from '../../utils/filter-builder';

export class ProductsService extends BaseApiService {
  constructor(config: LitiumConfig) {
    super(config);
  }

  /**
   * Search for base products
   * Supports searching by product ID, name, or article number
   */
  async searchBaseProducts(params?: {
    search?: string;
    skip?: number;
    take?: number;
    sort?: string;
  }) {
    const endpoint = '/Litium/api/admin/products/baseProducts/search';
    const searchModel = FilterBuilder.buildProductSearch(
      params?.search || '',
      params?.skip || 0,
      params?.take || 20
    );
    return this.searchPost<any>(endpoint, searchModel);
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
   * Supports searching by category ID or name
   */
  async searchCategories(params?: {
    search?: string;
    skip?: number;
    take?: number;
    sort?: string;
  }) {
    const endpoint = '/Litium/api/admin/products/categories/search';
    const searchModel = FilterBuilder.buildCategorySearch(
      params?.search || '',
      params?.skip || 0,
      params?.take || 20
    );
    return this.searchPost<any>(endpoint, searchModel);
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

  /**
   * Get subcategories for a category
   */
  async getCategorySubcategories(systemId: string) {
    const endpoint = `/Litium/api/admin/products/categories/${systemId}/categories`;
    return this.get<any>(endpoint);
  }

  // ==================== VARIANTS ====================

  /**
   * Search for product variants
   * Supports searching by variant ID, name, or article number
   */
  async searchVariants(params?: {
    search?: string;
    skip?: number;
    take?: number;
    sort?: string;
  }) {
    const endpoint = '/Litium/api/admin/products/variants/search';
    const searchModel = FilterBuilder.buildProductSearch(
      params?.search || '',
      params?.skip || 0,
      params?.take || 20
    );
    return this.searchPost<any>(endpoint, searchModel);
  }

  /**
   * Get a specific variant by system ID
   */
  async getVariant(systemId: string) {
    const endpoint = `/Litium/api/admin/products/variants/${systemId}`;
    return this.get<any>(endpoint);
  }

  /**
   * Create a new variant
   */
  async createVariant(variant: any) {
    const endpoint = '/Litium/api/admin/products/variants';
    return this.create<any>(endpoint, variant);
  }

  /**
   * Update an existing variant
   */
  async updateVariant(systemId: string, variant: any) {
    const endpoint = `/Litium/api/admin/products/variants/${systemId}`;
    return this.update<any>(endpoint, variant);
  }

  /**
   * Delete a variant
   */
  async deleteVariant(systemId: string) {
    const endpoint = `/Litium/api/admin/products/variants/${systemId}`;
    return this.delete(endpoint);
  }

  // ==================== PRICE LISTS ====================

  /**
   * Search for price lists
   * Supports searching by price list ID or name
   */
  async searchPriceLists(params?: {
    search?: string;
    skip?: number;
    take?: number;
    sort?: string;
  }) {
    const endpoint = '/Litium/api/admin/products/priceLists/search';
    const searchModel = FilterBuilder.buildGenericSearch(
      params?.search || '',
      params?.skip || 0,
      params?.take || 20
    );
    return this.searchPost<any>(endpoint, searchModel);
  }

  /**
   * Get a specific price list by system ID
   */
  async getPriceList(systemId: string) {
    const endpoint = `/Litium/api/admin/products/priceLists/${systemId}`;
    return this.get<any>(endpoint);
  }

  /**
   * Create a new price list
   */
  async createPriceList(priceList: any) {
    const endpoint = '/Litium/api/admin/products/priceLists';
    return this.create<any>(endpoint, priceList);
  }

  /**
   * Update an existing price list
   */
  async updatePriceList(systemId: string, priceList: any) {
    const endpoint = `/Litium/api/admin/products/priceLists/${systemId}`;
    return this.update<any>(endpoint, priceList);
  }

  /**
   * Delete a price list
   */
  async deletePriceList(systemId: string) {
    const endpoint = `/Litium/api/admin/products/priceLists/${systemId}`;
    return this.delete(endpoint);
  }

  /**
   * Get price list items for a product price list
   */
  async getPriceListItems(systemId: string) {
    const endpoint = `/Litium/api/admin/products/productPriceLists/${systemId}/items`;
    return this.get<any>(endpoint);
  }

  // ==================== RELATIONSHIP TYPES ====================

  /**
   * Get all relationship types
   */
  async getRelationshipTypes() {
    const endpoint = '/Litium/api/admin/products/relationshipTypes';
    return this.get<any>(endpoint);
  }

  /**
   * Get a specific relationship type by system ID
   */
  async getRelationshipType(systemId: string) {
    const endpoint = `/Litium/api/admin/products/relationshipTypes/${systemId}`;
    return this.get<any>(endpoint);
  }

  /**
   * Create a new relationship type
   */
  async createRelationshipType(relationshipType: any) {
    const endpoint = '/Litium/api/admin/products/relationshipTypes';
    return this.create<any>(endpoint, relationshipType);
  }

  /**
   * Update an existing relationship type
   */
  async updateRelationshipType(systemId: string, relationshipType: any) {
    const endpoint = `/Litium/api/admin/products/relationshipTypes/${systemId}`;
    return this.update<any>(endpoint, relationshipType);
  }

  /**
   * Delete a relationship type
   */
  async deleteRelationshipType(systemId: string) {
    const endpoint = `/Litium/api/admin/products/relationshipTypes/${systemId}`;
    return this.delete(endpoint);
  }
}