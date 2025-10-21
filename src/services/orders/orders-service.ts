import { BaseApiService } from '../base-api.js';
import { type LitiumConfig } from '../../types/config.js';

export class OrdersService extends BaseApiService {
  constructor(config: LitiumConfig) {
    super(config);
  }

  /**
   * Search for sales orders
   */
  async searchSalesOrders(params?: {
    search?: string;
    skip?: number;
    take?: number;
    sort?: string;
  }) {
    const endpoint = '/Litium/api/admin/sales/salesOrders/search';
    return this.searchPost<any>(endpoint, params);
  }

  /**
   * Get a specific sales order by system ID
   */
  async getSalesOrder(systemId: string) {
    const endpoint = `/Litium/api/admin/sales/salesOrders/${systemId}`;
    return this.get<any>(endpoint);
  }

  /**
   * Create a new sales order
   */
  async createSalesOrder(order: any) {
    const endpoint = '/Litium/api/admin/sales/salesOrders';
    return this.create<any>(endpoint, order);
  }

  /**
   * Update an existing sales order
   */
  async updateSalesOrder(systemId: string, order: any) {
    const endpoint = `/Litium/api/admin/sales/salesOrders/${systemId}`;
    return this.update<any>(endpoint, order);
  }

  /**
   * Delete a sales order
   */
  async deleteSalesOrder(systemId: string) {
    const endpoint = `/Litium/api/admin/sales/salesOrders/${systemId}`;
    return this.delete(endpoint);
  }

  /**
   * Search for sales return orders
   */
  async searchSalesReturnOrders(params?: {
    search?: string;
    skip?: number;
    take?: number;
    sort?: string;
  }) {
    const endpoint = '/Litium/api/admin/sales/salesReturnOrders/search';
    return this.searchPost<any>(endpoint, params);
  }

  /**
   * Get a specific sales return order
   */
  async getSalesReturnOrder(systemId: string) {
    const endpoint = `/Litium/api/admin/sales/salesReturnOrders/${systemId}`;
    return this.get<any>(endpoint);
  }

  /**
   * Create a new sales return order
   */
  async createSalesReturnOrder(order: any) {
    const endpoint = '/Litium/api/admin/sales/salesReturnOrders';
    return this.create<any>(endpoint, order);
  }

  /**
   * Update an existing sales return order
   */
  async updateSalesReturnOrder(systemId: string, order: any) {
    const endpoint = `/Litium/api/admin/sales/salesReturnOrders/${systemId}`;
    return this.update<any>(endpoint, order);
  }

  /**
   * Delete a sales return order
   */
  async deleteSalesReturnOrder(systemId: string) {
    const endpoint = `/Litium/api/admin/sales/salesReturnOrders/${systemId}`;
    return this.delete(endpoint);
  }

  /**
   * Search for shipments
   */
  async searchShipments(params?: {
    search?: string;
    skip?: number;
    take?: number;
    sort?: string;
  }) {
    const endpoint = '/Litium/api/admin/sales/shipments/search';
    return this.searchPost<any>(endpoint, params);
  }

  /**
   * Get a specific shipment
   */
  async getShipment(systemId: string) {
    const endpoint = `/Litium/api/admin/sales/shipments/${systemId}`;
    return this.get<any>(endpoint);
  }

  /**
   * Create a new shipment
   */
  async createShipment(shipment: any) {
    const endpoint = '/Litium/api/admin/sales/shipments';
    return this.create<any>(endpoint, shipment);
  }

  /**
   * Update an existing shipment
   */
  async updateShipment(systemId: string, shipment: any) {
    const endpoint = `/Litium/api/admin/sales/shipments/${systemId}`;
    return this.update<any>(endpoint, shipment);
  }

  /**
   * Delete a shipment
   */
  async deleteShipment(systemId: string) {
    const endpoint = `/Litium/api/admin/sales/shipments/${systemId}`;
    return this.delete(endpoint);
  }

  /**
   * Search for payments
   */
  async searchPayments(params?: {
    search?: string;
    skip?: number;
    take?: number;
    sort?: string;
  }) {
    const endpoint = '/Litium/api/admin/sales/payments/search';
    return this.searchPost<any>(endpoint, params);
  }

  /**
   * Get a specific payment
   */
  async getPayment(systemId: string) {
    const endpoint = `/Litium/api/admin/sales/payments/${systemId}`;
    return this.get<any>(endpoint);
  }

  /**
   * Create a new payment
   */
  async createPayment(payment: any) {
    const endpoint = '/Litium/api/admin/sales/payments';
    return this.create<any>(endpoint, payment);
  }

  /**
   * Update an existing payment
   */
  async updatePayment(systemId: string, payment: any) {
    const endpoint = `/Litium/api/admin/sales/payments/${systemId}`;
    return this.update<any>(endpoint, payment);
  }

  /**
   * Delete a payment
   */
  async deletePayment(systemId: string) {
    const endpoint = `/Litium/api/admin/sales/payments/${systemId}`;
    return this.delete(endpoint);
  }

  /**
   * Search for campaigns
   */
  async searchCampaigns(params?: {
    search?: string;
    skip?: number;
    take?: number;
    sort?: string;
  }) {
    const endpoint = '/Litium/api/admin/sales/campaigns/search';
    return this.search<any>(endpoint, params);
  }

  /**
   * Get a specific campaign
   */
  async getCampaign(systemId: string) {
    const endpoint = `/Litium/api/admin/sales/campaigns/${systemId}`;
    return this.get<any>(endpoint);
  }

  /**
   * Search for discounts
   */
  async searchDiscounts(params?: {
    search?: string;
    skip?: number;
    take?: number;
    sort?: string;
  }) {
    const endpoint = '/Litium/api/admin/sales/discounts/search';
    return this.search<any>(endpoint, params);
  }

  /**
   * Get a specific discount
   */
  async getDiscount(systemId: string) {
    const endpoint = `/Litium/api/admin/sales/discounts/${systemId}`;
    return this.get<any>(endpoint);
  }
}