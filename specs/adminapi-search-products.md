# Litium Admin API - Products Search Guide

## Overview

This guide covers searching product-related entities in the Litium Admin Web API.

## Supported Product Entities

| Entity | Endpoint | Description |
|--------|----------|-------------|
| BaseProduct | `POST /Litium/api/admin/products/baseProducts/search` | Base products (parent products) |
| Variant | `POST /Litium/api/admin/products/variants/search` | Product variants |
| Category | `POST /Litium/api/admin/products/categories/search` | Product categories |
| Inventory | `POST /Litium/api/admin/products/inventories/search` | Inventory items |

## BaseProduct Search

### Available Filters

1. **FieldFilterCondition** - Filter by product fields (name, description, etc.)
2. **CategoryFilterCondition** - Filter by category
3. **AssortmentFilterCondition** - Filter by assortment
4. **ChannelFilterCondition** - Filter by channel
5. **InventoryFilterCondition** - Filter by inventory levels
6. **PricelistFilterCondition** - Filter by price
7. **TemplateFilterCondition** - Filter by template
8. **IdFilterCondition** - Filter by product ID

**Note:** ~~`ProductFilterCondition`~~ is NOT supported (see warning below).

### ⚠️ Important: ProductFilterCondition Not Supported

**`ProductFilterCondition` exists in the codebase but is NOT supported in the AdminApi** because there's no registered `QueryFilterCondition` processor for it. It will be silently ignored if used. 

For searching products by name/description/other fields, use **`FieldFilterCondition`** instead (see examples below).

### Examples

#### 1. Find Products by Name

```json
{
  "filter": [
    {
      "$type": "Litium.Data.Queryable.Conditions.FieldFilterCondition, Litium.Abstractions",
      "operator": "contains",
      "value": "Nike",
      "id": "Name",
      "culture": "en-US"
    }
  ],
  "take": 20
}
```

#### 2. Find Products with "Yoga" in Name OR Description

To search for text in both name and description fields, use `bool` with `should` (OR logic):

```json
{
  "filter": [
    {
      "bool": {
        "should": [
          {
            "$type": "Litium.Data.Queryable.Conditions.FieldFilterCondition, Litium.Abstractions",
            "operator": "contains",
            "value": "yoga",
            "id": "Name",
            "culture": "en-US"
          },
          {
            "$type": "Litium.Data.Queryable.Conditions.FieldFilterCondition, Litium.Abstractions",
            "operator": "contains",
            "value": "yoga",
            "id": "Description",
            "culture": "en-US"
          }
        ]
      }
    }
  ],
  "take": 20
}
```

**Explanation**: This finds products where "yoga" appears in either the Name field OR the Description field. The `should` clause creates OR logic.

#### 3. Find Products in a Specific Category

```json
{
  "filter": [
    {
      "$type": "Litium.Data.Queryable.Conditions.CategoryFilterCondition, Litium.Abstractions",
      "operator": "eq",
      "categorySystemId": "12345678-1234-1234-1234-123456789012"
    }
  ],
  "take": 20
}
```

#### 4. Find Products in Multiple Categories (OR Logic)

```json
{
  "filter": [
    {
      "bool": {
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
        ]
      }
    }
  ],
  "take": 20
}
```

#### 5. Find Products by Assortment

```json
{
  "filter": [
    {
      "$type": "Litium.Data.Queryable.Conditions.AssortmentFilterCondition, Litium.Abstractions",
      "operator": "eq",
      "value": "assortment-guid"
    }
  ],
  "take": 20
}
```

#### 6. Find Products with Inventory Greater Than 10

```json
{
  "filter": [
    {
      "$type": "Litium.Data.Queryable.Conditions.InventoryFilterCondition, Litium.Abstractions",
      "operator": "gt+inventory-systemid-guid",
      "value": 10
    }
  ],
  "take": 20
}
```

**Note:** For inventory filtering, the operator format is `{operator}+{inventory-systemId}`.

#### 7. Find Products by Price Range

```json
{
  "filter": [
    {
      "bool": {
        "must": [
          {
            "$type": "Litium.Data.Queryable.Conditions.PricelistFilterCondition, Litium.Abstractions",
            "operator": "gte+pricelist-guid",
            "value": 50.00
          },
          {
            "$type": "Litium.Data.Queryable.Conditions.PricelistFilterCondition, Litium.Abstractions",
            "operator": "lte+pricelist-guid",
            "value": 200.00
          }
        ]
      }
    }
  ],
  "take": 20
}
```

**Note:** For price filtering, the operator format is `{operator}+{pricelist-systemId}`.

#### 8. Find Products by Template

```json
{
  "filter": [
    {
      "$type": "Litium.Data.Queryable.Conditions.TemplateFilterCondition, Litium.Abstractions",
      "operator": "eq",
      "value": "ProductTemplate"
    }
  ],
  "take": 20
}
```

#### 9. Find Products by ID Pattern

```json
{
  "filter": [
    {
      "$type": "Litium.Data.Queryable.Conditions.IdFilterCondition, Litium.Abstractions",
      "operator": "starts-with",
      "value": "PROD-"
    }
  ],
  "take": 20
}
```

#### 9. Complex Search: Name, Category, and Price Range

```json
{
  "filter": [
    {
      "bool": {
        "must": [
          {
            "$type": "Litium.Data.Queryable.Conditions.FieldFilterCondition, Litium.Abstractions",
            "operator": "contains",
            "value": "Shoes",
            "id": "Name",
            "culture": "en-US"
          },
          {
            "$type": "Litium.Data.Queryable.Conditions.CategoryFilterCondition, Litium.Abstractions",
            "operator": "eq",
            "categorySystemId": "category-guid"
          },
          {
            "$type": "Litium.Data.Queryable.Conditions.PricelistFilterCondition, Litium.Abstractions",
            "operator": "lte+pricelist-guid",
            "value": 150.00
          }
        ]
      }
    }
  ],
  "sort": [
    {
      "fieldId": "Name",
      "direction": "Ascending"
    }
  ],
  "take": 20
}
```

## Variant Search

Variants support the same filters as BaseProduct.

### Example: Find Variants of a Specific Size

```json
{
  "filter": [
    {
      "$type": "Litium.Data.Queryable.Conditions.FieldFilterCondition, Litium.Abstractions",
      "operator": "eq",
      "value": "Large",
      "id": "Size",
      "culture": "en-US"
    }
  ],
  "take": 20
}
```

## Category Search

### Available Filters

1. **FieldFilterCondition** - Filter by category fields
2. **IdFilterCondition** - Filter by category ID
3. **TemplateFilterCondition** - Filter by template

### Example: Find Categories by Name

```json
{
  "filter": [
    {
      "$type": "Litium.Data.Queryable.Conditions.FieldFilterCondition, Litium.Abstractions",
      "operator": "contains",
      "value": "Electronics",
      "id": "Name",
      "culture": "en-US"
    }
  ],
  "take": 20
}
```

## Inventory Search

### Available Filters

1. **FieldFilterCondition** - Filter by inventory fields
2. **IdFilterCondition** - Filter by inventory ID

### Example: Find Inventories by Warehouse

```json
{
  "filter": [
    {
      "$type": "Litium.Data.Queryable.Conditions.FieldFilterCondition, Litium.Abstractions",
      "operator": "eq",
      "value": "Warehouse A",
      "id": "WarehouseName",
      "culture": "en-US"
    }
  ],
  "take": 20
}
```

## Field Operators

### String Fields
- `eq` - Equals
- `neq` - Not equals
- `contains` - Contains substring
- `starts-with` - Starts with substring

### Numeric Fields
- `eq` - Equals
- `neq` - Not equals
- `gt` - Greater than
- `gte` - Greater than or equal
- `lt` - Less than
- `lte` - Less than or equal

### Boolean Fields
- `eq` - Equals (true/false)

## Sorting Products

```json
{
  "sort": [
    {
      "fieldId": "Name",
      "direction": "Ascending"
    },
    {
      "fieldId": "Price",
      "direction": "Descending"
    }
  ]
}
```

## Common Field IDs

Field IDs vary by template, but common fields include:

- `Name` - Product name
- `Description` - Product description
- `ArticleNumber` - Article/SKU number
- `Price` - Product price
- `Brand` - Product brand
- `Color` - Product color
- `Size` - Product size
- `Weight` - Product weight
- `Images` - Product images

## Response Example

```json
{
  "total": 150,
  "items": [
    {
      "systemId": "12345678-1234-1234-1234-123456789012",
      "id": "PROD-001",
      "fields": {
        "Name": {
          "en-US": "Nike Air Max"
        },
        "Price": {
          "*": 129.99
        }
      },
      // ... other properties
    }
  ]
}
```

## Tips

1. **Use Specific Cultures**: Always specify culture for localized fields
2. **Culture-Independent Fields**: Use `"*"` for fields without culture
3. **Inventory/Price Filters**: Operator format must include SystemId: `operator+systemId`
4. **Boolean Logic**: Combine filters with `must`, `should`, `mustNot` for complex queries
5. **Pagination**: Use `skip` and `take` for large result sets
6. **Performance**: Add filters to narrow results before sorting

## Error Cases

### Invalid Filter Condition
If you use a condition type that doesn't have a registered processor, it will be silently ignored.

### Invalid Operator
Using an unsupported operator throws an exception:
```json
{
  "error": "No operator matching 'invalid-operator'."
}
```

### Missing Required Properties
Some filter conditions require specific properties (e.g., `categorySystemId` for CategoryFilterCondition).

## Related Documentation

- [AdminAPI Search Overview](./adminapi-search-overview.md)
- [How to Get Product Images and Prices](./adminapi-products-images-and-prices.md) 📸💰
- [Sales Search Guide](./adminapi-search-sales.md)

