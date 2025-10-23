/**
 * Litium API Filter Builder
 * 
 * Builds filter conditions for Litium API search endpoints.
 * The Litium API uses a complex filter system with typed conditions.
 * 
 * Based on Litium Admin Web API documentation.
 */

export interface FilterCondition {
  $type: string;
  operator?: string;
  value?: any;
  id?: string;  // Field ID for FieldFilterCondition
  culture?: string;  // Culture for field filters (e.g., "en-US" or "*")
  categorySystemId?: string;  // For CategoryFilterCondition
  fromDate?: string;  // For DateRangeFilterCondition
  toDate?: string;  // For DateRangeFilterCondition
}

export interface BoolFilterModel {
  bool?: {
    must?: FilterCondition[];
    should?: FilterCondition[];
    mustNot?: FilterCondition[];
  };
}

export interface SortModel {
  fieldId: string;
  direction: 'Ascending' | 'Descending';
}

export interface SearchModel {
  skip?: number;
  take?: number;
  filter?: (FilterCondition | BoolFilterModel)[];
  sort?: SortModel[];
  queryOptions?: Record<string, any>;
}

/**
 * Filter Builder for creating Litium API search filters
 */
export class FilterBuilder {
  /**
   * Create an ID filter condition for exact or partial ID matching
   * Used for filtering by entity ID (not SystemId)
   * Operators: eq, neq, contains, starts-with
   */
  static idFilter(value: string, operator: 'eq' | 'neq' | 'contains' | 'starts-with' = 'contains'): FilterCondition {
    return {
      $type: 'Litium.Data.Queryable.Conditions.IdFilterCondition, Litium.Abstractions',
      operator,
      value
    };
  }

  /**
   * Create a field filter condition for custom field filtering
   * Operators: eq, neq, contains, starts-with, gt, gte, lt, lte
   */
  static fieldFilter(
    id: string, 
    value: any, 
    culture: string = '*',
    operator: 'eq' | 'neq' | 'contains' | 'starts-with' | 'gt' | 'gte' | 'lt' | 'lte' = 'contains'
  ): FilterCondition {
    return {
      $type: 'Litium.Data.Queryable.Conditions.FieldFilterCondition, Litium.Abstractions',
      id,
      culture,
      operator,
      value
    };
  }

  /**
   * Create a category filter condition for filtering products by category
   * Operators: eq, neq, contains
   */
  static categoryFilter(categorySystemId: string, operator: 'eq' | 'neq' | 'contains' = 'eq'): FilterCondition {
    return {
      $type: 'Litium.Data.Queryable.Conditions.CategoryFilterCondition, Litium.Abstractions',
      operator,
      categorySystemId
    };
  }

  /**
   * Create an assortment filter condition for filtering products by assortment
   * Operators: eq, neq, contains, not-contains
   */
  static assortmentFilter(value: string, operator: 'eq' | 'neq' | 'contains' | 'not-contains' = 'eq'): FilterCondition {
    return {
      $type: 'Litium.Data.Queryable.Conditions.AssortmentFilterCondition, Litium.Abstractions',
      operator,
      value
    };
  }

  /**
   * Create a template filter condition for filtering by template/field template
   * Operators: eq, neq, contains
   */
  static templateFilter(value: string, operator: 'eq' | 'neq' | 'contains' = 'eq'): FilterCondition {
    return {
      $type: 'Litium.Data.Queryable.Conditions.TemplateFilterCondition, Litium.Abstractions',
      operator,
      value
    };
  }

  /**
   * Create a channel filter condition for filtering by channel
   * Operators: eq, neq, null, any
   */
  static channelFilter(value: string, operator: 'eq' | 'neq' | 'null' | 'any' = 'eq'): FilterCondition {
    return {
      $type: 'Litium.Data.Queryable.Conditions.ChannelFilterCondition, Litium.Abstractions',
      operator,
      value
    };
  }

  /**
   * Create a tagging filter condition for filtering by tags
   * Operators: eq, neq, contains, not-contains, null, any
   * Only works with entities that support tagging (Shipment, Payment, Transaction)
   */
  static taggingFilter(value: string[], operator: 'eq' | 'neq' | 'contains' | 'not-contains' | 'null' | 'any' = 'contains'): FilterCondition {
    return {
      $type: 'Litium.Data.Queryable.Conditions.TaggingFilterCondition, Litium.Abstractions',
      operator,
      value
    };
  }

  /**
   * Create a date range filter condition for filtering by date ranges
   * Operators: between, gt, gte, lt, lte
   */
  static dateRangeFilter(fromDate?: string, toDate?: string, operator: 'between' | 'gt' | 'gte' | 'lt' | 'lte' = 'between'): FilterCondition {
    return {
      $type: 'Litium.Data.Queryable.Conditions.DateRangeFilterCondition, Litium.Abstractions',
      operator,
      fromDate,
      toDate
    };
  }

  /**
   * Create an inventory filter condition for filtering products by inventory levels
   * Operator format: {operator}+{inventory-systemId}
   * Operators: eq, neq, gt, gte, lt, lte
   */
  static inventoryFilter(inventorySystemId: string, value: number, operator: 'eq' | 'neq' | 'gt' | 'gte' | 'lt' | 'lte' = 'gt'): FilterCondition {
    return {
      $type: 'Litium.Data.Queryable.Conditions.InventoryFilterCondition, Litium.Abstractions',
      operator: `${operator}+${inventorySystemId}`,
      value
    };
  }

  /**
   * Create a price list filter condition for filtering products by price
   * Operator format: {operator}+{pricelist-systemId}
   * Operators: eq, neq, gt, gte, lt, lte
   */
  static pricelistFilter(pricelistSystemId: string, value: number, operator: 'eq' | 'neq' | 'gt' | 'gte' | 'lt' | 'lte' = 'gt'): FilterCondition {
    return {
      $type: 'Litium.Data.Queryable.Conditions.PricelistFilterCondition, Litium.Abstractions',
      operator: `${operator}+${pricelistSystemId}`,
      value
    };
  }


  /**
   * Combine multiple filters with AND logic (all must match)
   */
  static and(...filters: FilterCondition[]): BoolFilterModel {
    return {
      bool: {
        must: filters
      }
    };
  }

  /**
   * Combine multiple filters with OR logic (at least one must match)
   */
  static or(...filters: FilterCondition[]): BoolFilterModel {
    return {
      bool: {
        should: filters
      }
    };
  }

  /**
   * Combine multiple filters with NOT logic (must not match)
   */
  static not(...filters: FilterCondition[]): BoolFilterModel {
    return {
      bool: {
        mustNot: filters
      }
    };
  }

  /**
   * Create a complex boolean filter with must, should, and mustNot
   */
  static complex(must?: FilterCondition[], should?: FilterCondition[], mustNot?: FilterCondition[]): BoolFilterModel {
    return {
      bool: {
        must,
        should,
        mustNot
      }
    };
  }

  /**
   * Build a search model for orders
   * NOTE: Order search is NOT fully supported in AdminAPI.
   * Only basic ID search is available.
   * Based on adminapi-search-sales.md guide
   */
  static buildOrderSearch(searchTerm: string, skip = 0, take = 20): SearchModel {
    if (!searchTerm || searchTerm.trim() === '') {
      return { skip, take };
    }

    // Only search by order ID
    return {
      skip,
      take,
      filter: [this.idFilter(searchTerm.trim(), 'contains')]
    };
  }

  /**
   * Build a search model for products (base products or variants)
   * Searches by ID, Name, or ArticleNumber using OR logic
   * 
   * NOTE: Uses FieldFilterCondition, NOT ProductFilterCondition.
   * ProductFilterCondition exists but is NOT supported in AdminAPI
   * (no registered QueryFilterCondition processor for it).
   * 
   * Based on adminapi-search-products.md guide
   */
  static buildProductSearch(searchTerm: string, skip = 0, take = 20, culture = 'en-US'): SearchModel {
    if (!searchTerm || searchTerm.trim() === '') {
      return { skip, take };
    }

    const cleanTerm = searchTerm.trim();
    
    // Search across multiple fields with OR logic
    return {
      skip,
      take,
      filter: [
        this.or(
          this.idFilter(cleanTerm, 'contains'),
          this.fieldFilter('Name', cleanTerm, culture, 'contains'),
          this.fieldFilter('ArticleNumber', cleanTerm, '*', 'contains')
        )
      ]
    };
  }

  /**
   * Build a search model for categories
   * Searches by ID or Name
   */
  static buildCategorySearch(searchTerm: string, skip = 0, take = 20, culture = 'en-US'): SearchModel {
    if (!searchTerm || searchTerm.trim() === '') {
      return { skip, take };
    }

    const cleanTerm = searchTerm.trim();
    
    return {
      skip,
      take,
      filter: [
        this.or(
          this.idFilter(cleanTerm, 'contains'),
          this.fieldFilter('Name', cleanTerm, culture, 'contains')
        )
      ]
    };
  }

  /**
   * Build a search model for customers (people/organizations)
   * Searches by ID, FirstName, LastName, Email, or Phone
   * Based on adminapi-search-customers.md guide
   */
  static buildCustomerSearch(searchTerm: string, skip = 0, take = 20): SearchModel {
    if (!searchTerm || searchTerm.trim() === '') {
      return { skip, take };
    }

    const cleanTerm = searchTerm.trim();
    
    // Search across multiple customer fields with OR logic
    return {
      skip,
      take,
      filter: [
        this.or(
          this.idFilter(cleanTerm, 'contains'),
          this.fieldFilter('FirstName', cleanTerm, '*', 'contains'),
          this.fieldFilter('LastName', cleanTerm, '*', 'contains'),
          this.fieldFilter('Email', cleanTerm, '*', 'contains'),
          this.fieldFilter('Phone', cleanTerm, '*', 'contains')
        )
      ]
    };
  }

  /**
   * Build a search model for blocks
   * Searches by ID or BlockName field
   * Based on adminapi-search-blocks-websites.md guide
   */
  static buildBlockSearch(searchTerm: string, skip = 0, take = 20, culture = 'en-US'): SearchModel {
    if (!searchTerm || searchTerm.trim() === '') {
      return { skip, take };
    }

    const cleanTerm = searchTerm.trim();
    
    return {
      skip,
      take,
      filter: [
        this.or(
          this.idFilter(cleanTerm, 'contains'),
          this.fieldFilter('BlockName', cleanTerm, culture, 'contains')
        )
      ]
    };
  }

  /**
   * Build a search model for pages
   * Searches by ID or Title field
   * Based on adminapi-search-blocks-websites.md guide
   */
  static buildPageSearch(searchTerm: string, skip = 0, take = 20, culture = 'en-US'): SearchModel {
    if (!searchTerm || searchTerm.trim() === '') {
      return { skip, take };
    }

    const cleanTerm = searchTerm.trim();
    
    return {
      skip,
      take,
      filter: [
        this.or(
          this.idFilter(cleanTerm, 'contains'),
          this.fieldFilter('Title', cleanTerm, culture, 'contains')
        )
      ]
    };
  }

  /**
   * Build a search model for media files
   * Searches by ID or FileName field
   * Based on adminapi-search-media.md guide
   */
  static buildMediaSearch(searchTerm: string, skip = 0, take = 20): SearchModel {
    if (!searchTerm || searchTerm.trim() === '') {
      return { skip, take };
    }

    const cleanTerm = searchTerm.trim();
    
    return {
      skip,
      take,
      filter: [
        this.or(
          this.idFilter(cleanTerm, 'contains'),
          this.fieldFilter('FileName', cleanTerm, '*', 'contains'),
          this.fieldFilter('Description', cleanTerm, 'en-US', 'contains')
        )
      ]
    };
  }

  /**
   * Build a generic search model with just ID filter
   */
  static buildGenericSearch(searchTerm: string, skip = 0, take = 20): SearchModel {
    if (!searchTerm || searchTerm.trim() === '') {
      return { skip, take };
    }

    return {
      skip,
      take,
      filter: [this.idFilter(searchTerm.trim(), 'contains')]
    };
  }
}

