import { BaseApiService } from '../base-api';
import { type LitiumConfig } from '../../types/config';

export class GlobalizationService extends BaseApiService {
  constructor(config: LitiumConfig) {
    super(config);
  }

  // ==================== Channels ====================
  
  /**
   * Search for channels
   */
  async searchChannels(params?: {
    search?: string;
    skip?: number;
    take?: number;
    sort?: string;
  }) {
    const endpoint = '/Litium/api/admin/globalization/channels';
    return this.search<any>(endpoint, params);
  }

  /**
   * Get a specific channel by system ID
   */
  async getChannel(systemId: string) {
    const endpoint = `/Litium/api/admin/globalization/channels/${systemId}`;
    return this.get<any>(endpoint);
  }

  /**
   * Create a new channel
   */
  async createChannel(channel: any) {
    const endpoint = '/Litium/api/admin/globalization/channels';
    return this.create<any>(endpoint, channel);
  }

  /**
   * Update an existing channel
   */
  async updateChannel(systemId: string, channel: any) {
    const endpoint = `/Litium/api/admin/globalization/channels/${systemId}`;
    return this.update<any>(endpoint, channel);
  }

  /**
   * Delete a channel
   */
  async deleteChannel(systemId: string) {
    const endpoint = `/Litium/api/admin/globalization/channels/${systemId}`;
    return this.delete(endpoint);
  }

  /**
   * Clear channel cache
   */
  async clearChannelCache(systemId: string) {
    const endpoint = `/Litium/api/admin/globalization/channels/${systemId}/cache`;
    return this.tokenManager.makeAuthenticatedRequest<any>('DELETE', endpoint);
  }

  /**
   * Get channel key lookups
   */
  async getChannelKeyLookups(params?: { keys?: string[] }) {
    const endpoint = '/Litium/api/admin/globalization/channels/keyLookups';
    return this.tokenManager.makeAuthenticatedRequest<any>('POST', endpoint, params);
  }

  // ==================== Countries ====================

  /**
   * Search for countries
   */
  async searchCountries(params?: {
    search?: string;
    skip?: number;
    take?: number;
    sort?: string;
  }) {
    const endpoint = '/Litium/api/admin/globalization/countries';
    return this.search<any>(endpoint, params);
  }

  /**
   * Get a specific country by system ID
   */
  async getCountry(systemId: string) {
    const endpoint = `/Litium/api/admin/globalization/countries/${systemId}`;
    return this.get<any>(endpoint);
  }

  /**
   * Create a new country
   */
  async createCountry(country: any) {
    const endpoint = '/Litium/api/admin/globalization/countries';
    return this.create<any>(endpoint, country);
  }

  /**
   * Update an existing country
   */
  async updateCountry(systemId: string, country: any) {
    const endpoint = `/Litium/api/admin/globalization/countries/${systemId}`;
    return this.update<any>(endpoint, country);
  }

  /**
   * Delete a country
   */
  async deleteCountry(systemId: string) {
    const endpoint = `/Litium/api/admin/globalization/countries/${systemId}`;
    return this.delete(endpoint);
  }

  /**
   * Clear country cache
   */
  async clearCountryCache(systemId: string) {
    const endpoint = `/Litium/api/admin/globalization/countries/${systemId}/cache`;
    return this.tokenManager.makeAuthenticatedRequest<any>('DELETE', endpoint);
  }

  /**
   * Get country key lookups
   */
  async getCountryKeyLookups(params?: { keys?: string[] }) {
    const endpoint = '/Litium/api/admin/globalization/countries/keyLookups';
    return this.tokenManager.makeAuthenticatedRequest<any>('POST', endpoint, params);
  }

  // ==================== Currencies ====================

  /**
   * Search for currencies
   */
  async searchCurrencies(params?: {
    search?: string;
    skip?: number;
    take?: number;
    sort?: string;
  }) {
    const endpoint = '/Litium/api/admin/globalization/currencies';
    return this.search<any>(endpoint, params);
  }

  /**
   * Get a specific currency by system ID
   */
  async getCurrency(systemId: string) {
    const endpoint = `/Litium/api/admin/globalization/currencies/${systemId}`;
    return this.get<any>(endpoint);
  }

  /**
   * Create a new currency
   */
  async createCurrency(currency: any) {
    const endpoint = '/Litium/api/admin/globalization/currencies';
    return this.create<any>(endpoint, currency);
  }

  /**
   * Update an existing currency
   */
  async updateCurrency(systemId: string, currency: any) {
    const endpoint = `/Litium/api/admin/globalization/currencies/${systemId}`;
    return this.update<any>(endpoint, currency);
  }

  /**
   * Delete a currency
   */
  async deleteCurrency(systemId: string) {
    const endpoint = `/Litium/api/admin/globalization/currencies/${systemId}`;
    return this.delete(endpoint);
  }

  /**
   * Clear currency cache
   */
  async clearCurrencyCache(systemId: string) {
    const endpoint = `/Litium/api/admin/globalization/currencies/${systemId}/cache`;
    return this.tokenManager.makeAuthenticatedRequest<any>('DELETE', endpoint);
  }

  /**
   * Get currency key lookups
   */
  async getCurrencyKeyLookups(params?: { keys?: string[] }) {
    const endpoint = '/Litium/api/admin/globalization/currencies/keyLookups';
    return this.tokenManager.makeAuthenticatedRequest<any>('POST', endpoint, params);
  }

  // ==================== Domain Names ====================

  /**
   * Search for domain names
   */
  async searchDomainNames(params?: {
    search?: string;
    skip?: number;
    take?: number;
    sort?: string;
  }) {
    const endpoint = '/Litium/api/admin/globalization/domainNames';
    return this.search<any>(endpoint, params);
  }

  /**
   * Get a specific domain name by system ID
   */
  async getDomainName(systemId: string) {
    const endpoint = `/Litium/api/admin/globalization/domainNames/${systemId}`;
    return this.get<any>(endpoint);
  }

  /**
   * Create a new domain name
   */
  async createDomainName(domainName: any) {
    const endpoint = '/Litium/api/admin/globalization/domainNames';
    return this.create<any>(endpoint, domainName);
  }

  /**
   * Update an existing domain name
   */
  async updateDomainName(systemId: string, domainName: any) {
    const endpoint = `/Litium/api/admin/globalization/domainNames/${systemId}`;
    return this.update<any>(endpoint, domainName);
  }

  /**
   * Delete a domain name
   */
  async deleteDomainName(systemId: string) {
    const endpoint = `/Litium/api/admin/globalization/domainNames/${systemId}`;
    return this.delete(endpoint);
  }

  /**
   * Clear domain name cache
   */
  async clearDomainNameCache(systemId: string) {
    const endpoint = `/Litium/api/admin/globalization/domainNames/${systemId}/cache`;
    return this.tokenManager.makeAuthenticatedRequest<any>('DELETE', endpoint);
  }

  /**
   * Get domain name key lookups
   */
  async getDomainNameKeyLookups(params?: { keys?: string[] }) {
    const endpoint = '/Litium/api/admin/globalization/domainNames/keyLookups';
    return this.tokenManager.makeAuthenticatedRequest<any>('POST', endpoint, params);
  }

  // ==================== Languages ====================

  /**
   * Search for languages
   */
  async searchLanguages(params?: {
    search?: string;
    skip?: number;
    take?: number;
    sort?: string;
  }) {
    const endpoint = '/Litium/api/admin/globalization/languages';
    return this.search<any>(endpoint, params);
  }

  /**
   * Get a specific language by system ID
   */
  async getLanguage(systemId: string) {
    const endpoint = `/Litium/api/admin/globalization/languages/${systemId}`;
    return this.get<any>(endpoint);
  }

  /**
   * Create a new language
   */
  async createLanguage(language: any) {
    const endpoint = '/Litium/api/admin/globalization/languages';
    return this.create<any>(endpoint, language);
  }

  /**
   * Update an existing language
   */
  async updateLanguage(systemId: string, language: any) {
    const endpoint = `/Litium/api/admin/globalization/languages/${systemId}`;
    return this.update<any>(endpoint, language);
  }

  /**
   * Delete a language
   */
  async deleteLanguage(systemId: string) {
    const endpoint = `/Litium/api/admin/globalization/languages/${systemId}`;
    return this.delete(endpoint);
  }

  /**
   * Clear language cache
   */
  async clearLanguageCache(systemId: string) {
    const endpoint = `/Litium/api/admin/globalization/languages/${systemId}/cache`;
    return this.tokenManager.makeAuthenticatedRequest<any>('DELETE', endpoint);
  }

  /**
   * Get language key lookups
   */
  async getLanguageKeyLookups(params?: { keys?: string[] }) {
    const endpoint = '/Litium/api/admin/globalization/languages/keyLookups';
    return this.tokenManager.makeAuthenticatedRequest<any>('POST', endpoint, params);
  }

  // ==================== Markets ====================

  /**
   * Search for markets
   */
  async searchMarkets(params?: {
    search?: string;
    skip?: number;
    take?: number;
    sort?: string;
  }) {
    const endpoint = '/Litium/api/admin/globalization/markets';
    return this.search<any>(endpoint, params);
  }

  /**
   * Get a specific market by system ID
   */
  async getMarket(systemId: string) {
    const endpoint = `/Litium/api/admin/globalization/markets/${systemId}`;
    return this.get<any>(endpoint);
  }

  /**
   * Create a new market
   */
  async createMarket(market: any) {
    const endpoint = '/Litium/api/admin/globalization/markets';
    return this.create<any>(endpoint, market);
  }

  /**
   * Update an existing market
   */
  async updateMarket(systemId: string, market: any) {
    const endpoint = `/Litium/api/admin/globalization/markets/${systemId}`;
    return this.update<any>(endpoint, market);
  }

  /**
   * Delete a market
   */
  async deleteMarket(systemId: string) {
    const endpoint = `/Litium/api/admin/globalization/markets/${systemId}`;
    return this.delete(endpoint);
  }

  /**
   * Clear market cache
   */
  async clearMarketCache(systemId: string) {
    const endpoint = `/Litium/api/admin/globalization/markets/${systemId}/cache`;
    return this.tokenManager.makeAuthenticatedRequest<any>('DELETE', endpoint);
  }

  /**
   * Get market key lookups
   */
  async getMarketKeyLookups(params?: { keys?: string[] }) {
    const endpoint = '/Litium/api/admin/globalization/markets/keyLookups';
    return this.tokenManager.makeAuthenticatedRequest<any>('POST', endpoint, params);
  }

  // ==================== Tax Classes ====================

  /**
   * Search for tax classes
   */
  async searchTaxClasses(params?: {
    search?: string;
    skip?: number;
    take?: number;
    sort?: string;
  }) {
    const endpoint = '/Litium/api/admin/globalization/taxClasses';
    return this.search<any>(endpoint, params);
  }

  /**
   * Get a specific tax class by system ID
   */
  async getTaxClass(systemId: string) {
    const endpoint = `/Litium/api/admin/globalization/taxClasses/${systemId}`;
    return this.get<any>(endpoint);
  }

  /**
   * Create a new tax class
   */
  async createTaxClass(taxClass: any) {
    const endpoint = '/Litium/api/admin/globalization/taxClasses';
    return this.create<any>(endpoint, taxClass);
  }

  /**
   * Update an existing tax class
   */
  async updateTaxClass(systemId: string, taxClass: any) {
    const endpoint = `/Litium/api/admin/globalization/taxClasses/${systemId}`;
    return this.update<any>(endpoint, taxClass);
  }

  /**
   * Delete a tax class
   */
  async deleteTaxClass(systemId: string) {
    const endpoint = `/Litium/api/admin/globalization/taxClasses/${systemId}`;
    return this.delete(endpoint);
  }

  /**
   * Clear tax class cache
   */
  async clearTaxClassCache(systemId: string) {
    const endpoint = `/Litium/api/admin/globalization/taxClasses/${systemId}/cache`;
    return this.tokenManager.makeAuthenticatedRequest<any>('DELETE', endpoint);
  }

  /**
   * Get tax class key lookups
   */
  async getTaxClassKeyLookups(params?: { keys?: string[] }) {
    const endpoint = '/Litium/api/admin/globalization/taxClasses/keyLookups';
    return this.tokenManager.makeAuthenticatedRequest<any>('POST', endpoint, params);
  }

  // ==================== Field Definitions ====================

  /**
   * Search for globalization field definitions
   */
  async searchFieldDefinitions(params?: {
    search?: string;
    skip?: number;
    take?: number;
    sort?: string;
  }) {
    const endpoint = '/Litium/api/admin/globalization/fieldDefinitions';
    return this.search<any>(endpoint, params);
  }

  /**
   * Get a specific field definition by system ID
   */
  async getFieldDefinition(systemId: string) {
    const endpoint = `/Litium/api/admin/globalization/fieldDefinitions/${systemId}`;
    return this.get<any>(endpoint);
  }

  /**
   * Create a new field definition
   */
  async createFieldDefinition(fieldDefinition: any) {
    const endpoint = '/Litium/api/admin/globalization/fieldDefinitions';
    return this.create<any>(endpoint, fieldDefinition);
  }

  /**
   * Update an existing field definition
   */
  async updateFieldDefinition(systemId: string, fieldDefinition: any) {
    const endpoint = `/Litium/api/admin/globalization/fieldDefinitions/${systemId}`;
    return this.update<any>(endpoint, fieldDefinition);
  }

  /**
   * Delete a field definition
   */
  async deleteFieldDefinition(systemId: string) {
    const endpoint = `/Litium/api/admin/globalization/fieldDefinitions/${systemId}`;
    return this.delete(endpoint);
  }

  /**
   * Clear field definition cache
   */
  async clearFieldDefinitionCache(systemId: string) {
    const endpoint = `/Litium/api/admin/globalization/fieldDefinitions/${systemId}/cache`;
    return this.tokenManager.makeAuthenticatedRequest<any>('DELETE', endpoint);
  }

  /**
   * Get field definition key lookups
   */
  async getFieldDefinitionKeyLookups(params?: { keys?: string[] }) {
    const endpoint = '/Litium/api/admin/globalization/fieldDefinitions/keyLookups';
    return this.tokenManager.makeAuthenticatedRequest<any>('POST', endpoint, params);
  }

  // ==================== Field Templates ====================

  /**
   * Search for globalization field templates
   */
  async searchFieldTemplates(params?: {
    search?: string;
    skip?: number;
    take?: number;
    sort?: string;
  }) {
    const endpoint = '/Litium/api/admin/globalization/fieldTemplates';
    return this.search<any>(endpoint, params);
  }

  /**
   * Get a specific field template by system ID
   */
  async getFieldTemplate(systemId: string) {
    const endpoint = `/Litium/api/admin/globalization/fieldTemplates/${systemId}`;
    return this.get<any>(endpoint);
  }

  /**
   * Create a new field template
   */
  async createFieldTemplate(fieldTemplate: any) {
    const endpoint = '/Litium/api/admin/globalization/fieldTemplates';
    return this.create<any>(endpoint, fieldTemplate);
  }

  /**
   * Update an existing field template
   */
  async updateFieldTemplate(systemId: string, fieldTemplate: any) {
    const endpoint = `/Litium/api/admin/globalization/fieldTemplates/${systemId}`;
    return this.update<any>(endpoint, fieldTemplate);
  }

  /**
   * Delete a field template
   */
  async deleteFieldTemplate(systemId: string) {
    const endpoint = `/Litium/api/admin/globalization/fieldTemplates/${systemId}`;
    return this.delete(endpoint);
  }

  /**
   * Clear field template cache
   */
  async clearFieldTemplateCache(systemId: string) {
    const endpoint = `/Litium/api/admin/globalization/fieldTemplates/${systemId}/cache`;
    return this.tokenManager.makeAuthenticatedRequest<any>('DELETE', endpoint);
  }

  /**
   * Get field template key lookups
   */
  async getFieldTemplateKeyLookups(params?: { keys?: string[] }) {
    const endpoint = '/Litium/api/admin/globalization/fieldTemplates/keyLookups';
    return this.tokenManager.makeAuthenticatedRequest<any>('POST', endpoint, params);
  }
}

