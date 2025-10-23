# Litium Admin API - Search Endpoints Overview

## Introduction

The Litium Admin Web API provides generic search endpoints for entities implementing `IQuerySupport`. This document provides an overview of all available search endpoints and their capabilities.

## Base URL Pattern

```
POST /Litium/api/admin/{area}/{type}/search
```

Where:
- `{area}` = Entity namespace (e.g., "products", "sales", "blocks", "websites", "media", "customers")
- `{type}` = Pluralized entity name (e.g., "baseProducts", "categories", "blocks", "pages")

## Supported Entities

### Products Area (`/Litium/api/admin/products/...`)

| Entity | Endpoint | Supports Fields | Supports Tagging |
|--------|----------|----------------|------------------|
| BaseProduct | `/products/baseProducts/search` | ✅ Yes | ❌ No |
| Variant | `/products/variants/search` | ✅ Yes | ❌ No |
| Category | `/products/categories/search` | ✅ Yes | ❌ No |
| Inventory | `/products/inventories/search` | ✅ Yes | ❌ No |

### Blocks Area (`/Litium/api/admin/blocks/...`)

| Entity | Endpoint | Supports Fields | Supports Tagging |
|--------|----------|----------------|------------------|
| Block | `/blocks/blocks/search` | ✅ Yes | ❌ No |
| DraftBlock | `/blocks/draftBlocks/search` | ✅ Yes | ❌ No |

### Websites Area (`/Litium/api/admin/websites/...`)

| Entity | Endpoint | Supports Fields | Supports Tagging |
|--------|----------|----------------|------------------|
| Page | `/websites/pages/search` | ✅ Yes | ❌ No |
| DraftPage | `/websites/draftPages/search` | ✅ Yes | ❌ No |
| Website | `/websites/websites/search` | ✅ Yes | ❌ No |
| UrlRedirect | `/websites/urlRedirects/search` | ❌ No | ❌ No |

### Media Area (`/Litium/api/admin/media/...`)

| Entity | Endpoint | Supports Fields | Supports Tagging |
|--------|----------|----------------|------------------|
| File | `/media/files/search` | ✅ Yes | ❌ No |
| Folder | `/media/folders/search` | ✅ Yes | ❌ No |

### Customers Area (`/Litium/api/admin/customers/...`)

| Entity | Endpoint | Supports Fields | Supports Tagging |
|--------|----------|----------------|------------------|
| Person | `/customers/persons/search` | ✅ Yes | ❌ No |
| Organization | `/customers/organizations/search` | ✅ Yes | ❌ No |
| TargetGroup | `/customers/targetGroups/search` | ✅ Yes | ❌ No |

### Sales Area (`/Litium/api/admin/sales/...`)

| Entity | Endpoint | Supports Fields | Supports Tagging |
|--------|----------|----------------|------------------|
| Shipment | `/sales/shipments/search` | ✅ Yes | ✅ Yes |
| Payment | `/sales/payments/search` | ✅ Yes | ✅ Yes |
| Transaction | `/sales/transactions/search` | ✅ Yes | ✅ Yes |
| GiftCard | `/sales/giftCards/search` | ✅ Yes | ❌ No |
| ReturnAuthorization | `/sales/returnAuthorizations/search` | ✅ Yes | ❌ No |
| Discount | `/sales/discounts/search` | ✅ Yes | ❌ No |
| Campaign | `/sales/campaigns/search` | ✅ Yes | ❌ No |

## Excluded Entities (No Search Support)

The following entities do **NOT** have search endpoints:

**Products:**
- DynamicProductList, StaticProductList, ProductPriceList, CampaignPriceList
- Product (use BaseProduct or Variant instead)

**Customers:**
- DynamicGroup, ContextualGroup, StaticGroup

**Sales:**
- Order, SalesOrder, SalesReturnOrder (use Administration API instead)
- Discount<T> (generic discount types)

**Other:**
- Tag
- ActivityLog

## Common Request Structure

```json
{
  "filter": [
    {
      "$type": "Litium.Data.Queryable.Conditions.FieldFilterCondition, Litium.Abstractions",
      "operator": "eq",
      "value": "search-value",
      "id": "field-id",
      "culture": "en-US"
    }
  ],
  "sort": [
    {
      "fieldId": "field-id",
      "direction": "Ascending"
    }
  ],
  "skip": 0,
  "take": 20,
  "queryOptions": {}
}
```

## Available Filter Conditions

### 1. FieldFilterCondition
**Assembly:** `Litium.Data.Queryable.Conditions.FieldFilterCondition, Litium.Abstractions`

Used for filtering by field values on entities with fields.

**Operators:** `eq`, `neq`, `contains`, `starts-with`, `gt`, `gte`, `lt`, `lte`

**Example:**
```json
{
  "$type": "Litium.Data.Queryable.Conditions.FieldFilterCondition, Litium.Abstractions",
  "operator": "contains",
  "value": "Nike",
  "id": "ProductName",
  "culture": "en-US"
}
```

### 2. IdFilterCondition
**Assembly:** `Litium.Data.Queryable.Conditions.IdFilterCondition, Litium.Abstractions`

Used for filtering by entity ID (not SystemId).

**Operators:** `eq`, `neq`, `contains`, `starts-with`

**Example:**
```json
{
  "$type": "Litium.Data.Queryable.Conditions.IdFilterCondition, Litium.Abstractions",
  "operator": "contains",
  "value": "PROD-"
}
```

### 3. TaggingFilterCondition
**Assembly:** `Litium.Data.Queryable.Conditions.TaggingFilterCondition, Litium.Abstractions`

Used for filtering by tags (only for taggable entities).

**Operators:** `eq`, `neq`, `contains`, `not-contains`, `null`, `any`

**Example:**
```json
{
  "$type": "Litium.Data.Queryable.Conditions.TaggingFilterCondition, Litium.Abstractions",
  "operator": "contains",
  "value": ["urgent", "priority"]
}
```

### 4. DateRangeFilterCondition
**Assembly:** `Litium.Data.Queryable.Conditions.DateRangeFilterCondition, Litium.Abstractions`

Used for filtering by date ranges.

**Operators:** `between`, `gt`, `gte`, `lt`, `lte`

**Example:**
```json
{
  "$type": "Litium.Data.Queryable.Conditions.DateRangeFilterCondition, Litium.Abstractions",
  "operator": "between",
  "fromDate": "2024-01-01T00:00:00Z",
  "toDate": "2024-12-31T23:59:59Z"
}
```

### 5. AssortmentFilterCondition
**Assembly:** `Litium.Data.Queryable.Conditions.AssortmentFilterCondition, Litium.Abstractions`

Used for filtering products by assortment.

**Operators:** `eq`, `neq`, `contains`, `not-contains`

**Example:**
```json
{
  "$type": "Litium.Data.Queryable.Conditions.AssortmentFilterCondition, Litium.Abstractions",
  "operator": "eq",
  "value": "guid-of-assortment"
}
```

### 6. CategoryFilterCondition
**Assembly:** `Litium.Data.Queryable.Conditions.CategoryFilterCondition, Litium.Abstractions`

Used for filtering products by category.

**Operators:** `eq`, `neq`, `contains`

**Example:**
```json
{
  "$type": "Litium.Data.Queryable.Conditions.CategoryFilterCondition, Litium.Abstractions",
  "operator": "eq",
  "categorySystemId": "guid-of-category"
}
```

### 7. ChannelFilterCondition
**Assembly:** `Litium.Data.Queryable.Conditions.ChannelFilterCondition, Litium.Abstractions`

Used for filtering by channel.

**Operators:** `eq`, `neq`, `null`, `any`

**Example:**
```json
{
  "$type": "Litium.Data.Queryable.Conditions.ChannelFilterCondition, Litium.Abstractions",
  "operator": "eq",
  "value": "guid-of-channel"
}
```

### 8. InventoryFilterCondition
**Assembly:** `Litium.Data.Queryable.Conditions.InventoryFilterCondition, Litium.Abstractions`

Used for filtering products by inventory levels.

**Operators:** `eq`, `neq`, `gt`, `gte`, `lt`, `lte`

**Example:**
```json
{
  "$type": "Litium.Data.Queryable.Conditions.InventoryFilterCondition, Litium.Abstractions",
  "operator": "gt+guid-of-inventory",
  "value": 10
}
```

### 9. PricelistFilterCondition
**Assembly:** `Litium.Data.Queryable.Conditions.PricelistFilterCondition, Litium.Abstractions`

Used for filtering products by price.

**Operators:** `eq`, `neq`, `gt`, `gte`, `lt`, `lte`

**Example:**
```json
{
  "$type": "Litium.Data.Queryable.Conditions.PricelistFilterCondition, Litium.Abstractions",
  "operator": "gt+guid-of-pricelist",
  "value": 100.00
}
```

### 10. TemplateFilterCondition
**Assembly:** `Litium.Data.Queryable.Conditions.TemplateFilterCondition, Litium.Abstractions`

Used for filtering by template/field template.

**Operators:** `eq`, `neq`, `contains`

**Example:**
```json
{
  "$type": "Litium.Data.Queryable.Conditions.TemplateFilterCondition, Litium.Abstractions",
  "operator": "eq",
  "value": "template-id"
}
```

## Response Format

All search endpoints return the same response format:

```json
{
  "total": 150,
  "items": [
    {
      "systemId": "guid-value",
      // ... entity properties
    }
  ]
}
```

## Boolean Filters (Combining Multiple Conditions)

You can combine multiple filters using boolean logic:

```json
{
  "filter": [
    {
      "bool": {
        "must": [
          {
            "$type": "Litium.Data.Queryable.Conditions.FieldFilterCondition, Litium.Abstractions",
            "operator": "contains",
            "value": "Nike",
            "id": "ProductName",
            "culture": "en-US"
          }
        ],
        "should": [
          {
            "$type": "Litium.Data.Queryable.Conditions.CategoryFilterCondition, Litium.Abstractions",
            "operator": "eq",
            "categorySystemId": "category-guid-1"
          },
          {
            "$type": "Litium.Data.Queryable.Conditions.CategoryFilterCondition, Litium.Abstractions",
            "operator": "eq",
            "categorySystemId": "category-guid-2"
          }
        ],
        "mustNot": [
          {
            "$type": "Litium.Data.Queryable.Conditions.FieldFilterCondition, Litium.Abstractions",
            "operator": "eq",
            "value": "Discontinued",
            "id": "Status",
            "culture": "en-US"
          }
        ]
      }
    }
  ]
}
```

## Sorting

Sort by field values:

```json
{
  "sort": [
    {
      "fieldId": "ProductName",
      "direction": "Ascending"
    },
    {
      "fieldId": "Price",
      "direction": "Descending"
    }
  ]
}
```

**Direction values:** `Ascending` or `Descending`

## Pagination

```json
{
  "skip": 0,    // Number of items to skip
  "take": 20    // Number of items to return (max recommended: 100)
}
```

## Query Options

Additional query options can be passed:

```json
{
  "queryOptions": {
    "includeInactive": true,
    "customOption": "value"
  }
}
```

## Important Notes

1. **Type Names**: Always include the full assembly-qualified type name in `$type`
2. **Case Sensitivity**: Operators are case-insensitive
3. **Authorization**: Requires proper authorization based on entity type
4. **Field Culture**: Use `"*"` for culture-independent fields or specific culture codes
5. **Filter Support**: Not all filter conditions work with all entity types
6. **Silent Failures**: If a filter condition is not supported, it may be silently ignored

## Error Handling

Common HTTP status codes:

- **200 OK**: Successful search
- **400 Bad Request**: Invalid request model
- **401 Unauthorized**: Missing or invalid authentication
- **403 Forbidden**: Insufficient permissions
- **404 Not Found**: Entity type not found or not supported

## Next Steps

For detailed documentation on specific entity types, see:

- [Products Search Guide](./adminapi-search-products.md)
- [How to Get Product Images and Prices](./adminapi-products-images-and-prices.md) - Essential guide for product data
- [Blocks Search Guide](./adminapi-search-blocks.md)
- [Websites Search Guide](./adminapi-search-websites.md)
- [Media Search Guide](./adminapi-search-media.md)
- [Customers Search Guide](./adminapi-search-customers.md)
- [Sales Search Guide](./adminapi-search-sales.md)

