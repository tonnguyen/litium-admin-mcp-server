import { BaseApiService } from '../base-api';
import { type LitiumConfig } from '../../types/config';

export class CustomersService extends BaseApiService {
  constructor(config: LitiumConfig) {
    super(config);
  }

  /**
   * Search for customers (people)
   */
  async searchCustomers(params?: {
    search?: string;
    skip?: number;
    take?: number;
    sort?: string;
  }) {
    const endpoint = '/Litium/api/admin/customers/people/search';
    return this.search<any>(endpoint, params);
  }

  /**
   * Get a specific customer by system ID
   */
  async getCustomer(systemId: string) {
    const endpoint = `/Litium/api/admin/customers/people/${systemId}`;
    return this.get<any>(endpoint);
  }

  /**
   * Create a new customer
   */
  async createCustomer(customer: any) {
    const endpoint = '/Litium/api/admin/customers/people';
    return this.create<any>(endpoint, customer);
  }

  /**
   * Update an existing customer
   */
  async updateCustomer(systemId: string, customer: any) {
    const endpoint = `/Litium/api/admin/customers/people/${systemId}`;
    return this.update<any>(endpoint, customer);
  }

  /**
   * Delete a customer
   */
  async deleteCustomer(systemId: string) {
    const endpoint = `/Litium/api/admin/customers/people/${systemId}`;
    return this.delete(endpoint);
  }

  /**
   * Search for customer groups
   */
  async searchCustomerGroups(params?: {
    search?: string;
    skip?: number;
    take?: number;
    sort?: string;
  }) {
    const endpoint = '/Litium/api/admin/customers/groups/search';
    return this.search<any>(endpoint, params);
  }

  /**
   * Get a specific customer group
   */
  async getCustomerGroup(systemId: string) {
    const endpoint = `/Litium/api/admin/customers/groups/${systemId}`;
    return this.get<any>(endpoint);
  }

  /**
   * Create a new customer group
   */
  async createCustomerGroup(group: any) {
    const endpoint = '/Litium/api/admin/customers/groups';
    return this.create<any>(endpoint, group);
  }

  /**
   * Update an existing customer group
   */
  async updateCustomerGroup(systemId: string, group: any) {
    const endpoint = `/Litium/api/admin/customers/groups/${systemId}`;
    return this.update<any>(endpoint, group);
  }

  /**
   * Delete a customer group
   */
  async deleteCustomerGroup(systemId: string) {
    const endpoint = `/Litium/api/admin/customers/groups/${systemId}`;
    return this.delete(endpoint);
  }

  /**
   * Search for organizations
   */
  async searchOrganizations(params?: {
    search?: string;
    skip?: number;
    take?: number;
    sort?: string;
  }) {
    const endpoint = '/Litium/api/admin/customers/organizations/search';
    return this.search<any>(endpoint, params);
  }

  /**
   * Get a specific organization
   */
  async getOrganization(systemId: string) {
    const endpoint = `/Litium/api/admin/customers/organizations/${systemId}`;
    return this.get<any>(endpoint);
  }

  /**
   * Create a new organization
   */
  async createOrganization(organization: any) {
    const endpoint = '/Litium/api/admin/customers/organizations';
    return this.create<any>(endpoint, organization);
  }

  /**
   * Update an existing organization
   */
  async updateOrganization(systemId: string, organization: any) {
    const endpoint = `/Litium/api/admin/customers/organizations/${systemId}`;
    return this.update<any>(endpoint, organization);
  }

  /**
   * Delete an organization
   */
  async deleteOrganization(systemId: string) {
    const endpoint = `/Litium/api/admin/customers/organizations/${systemId}`;
    return this.delete(endpoint);
  }

  /**
   * Get address types
   */
  async getAddressTypes(params?: {
    search?: string;
    skip?: number;
    take?: number;
    sort?: string;
  }) {
    const endpoint = '/Litium/api/admin/customers/addressTypes';
    return this.search<any>(endpoint, params);
  }

  /**
   * Get a specific address type
   */
  async getAddressType(systemId: string) {
    const endpoint = `/Litium/api/admin/customers/addressTypes/${systemId}`;
    return this.get<any>(endpoint);
  }

  /**
   * Get field definitions for customers
   */
  async getFieldDefinitions(params?: {
    search?: string;
    skip?: number;
    take?: number;
    sort?: string;
  }) {
    const endpoint = '/Litium/api/admin/customers/fieldDefinitions';
    return this.search<any>(endpoint, params);
  }

  /**
   * Get field templates for customers
   */
  async getFieldTemplates(params?: {
    search?: string;
    skip?: number;
    take?: number;
    sort?: string;
  }) {
    const endpoint = '/Litium/api/admin/customers/fieldTemplates';
    return this.search<any>(endpoint, params);
  }
}