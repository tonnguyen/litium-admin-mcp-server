# Litium Admin API - Sales Search Guide

## Overview

This guide covers searching sales-related entities in the Litium Admin Web API.

## ⚠️ Important Limitation: Orders Are NOT Supported

**Sales Orders, Sales Return Orders, and the base Order entity do NOT have search endpoints in the AdminApi.**

The following entities are **excluded** from the AdminApi search:
- `Order` (base class)
- `SalesOrder`
- `SalesReturnOrder`
- `Discount<T>` (generic discount types)

**For order searching, see:** [Sales Order Search Workaround](./sales-order-search-workaround.md)

## Supported Sales Entities

| Entity | Endpoint | Supports Tags | Description |
|--------|----------|---------------|-------------|
| Shipment | `POST /Litium/api/admin/sales/shipments/search` | ✅ Yes | Order shipments |
| Payment | `POST /Litium/api/admin/sales/payments/search` | ✅ Yes | Order payments |
| Transaction | `POST /Litium/api/admin/sales/transactions/search` | ✅ Yes | Payment transactions |
| GiftCard | `POST /Litium/api/admin/sales/giftCards/search` | ❌ No | Gift cards |
| ReturnAuthorization | `POST /Litium/api/admin/sales/returnAuthorizations/search` | ❌ No | Return authorizations (RMAs) |
| Discount | `POST /Litium/api/admin/sales/discounts/search` | ❌ No | Discount definitions |
| Campaign | `POST /Litium/api/admin/sales/campaigns/search` | ❌ No | Marketing campaigns |

## Shipment Search

### Available Filters

1. **FieldFilterCondition** - Filter by shipment fields
2. **TaggingFilterCondition** - Filter by shipment tags
3. **IdFilterCondition** - Filter by shipment ID
4. **DateRangeFilterCondition** - Filter by date ranges

### Examples

#### 1. Find Shipments by Tracking Number

```json
{
  "filter": [
    {
      "$type": "Litium.Data.Queryable.Conditions.FieldFilterCondition, Litium.Abstractions",
      "operator": "contains",
      "value": "TRACK-123",
      "id": "TrackingNumber",
      "culture": "*"
    }
  ],
  "take": 20
}
```

#### 2. Find Shipments by Tag

```json
{
  "filter": [
    {
      "$type": "Litium.Data.Queryable.Conditions.TaggingFilterCondition, Litium.Abstractions",
      "operator": "contains",
      "value": ["urgent", "priority"]
    }
  ],
  "take": 20
}
```

#### 3. Find Shipments by Date Range

```json
{
  "filter": [
    {
      "$type": "Litium.Data.Queryable.Conditions.DateRangeFilterCondition, Litium.Abstractions",
      "operator": "between",
      "fromDate": "2024-01-01T00:00:00Z",
      "toDate": "2024-12-31T23:59:59Z"
    }
  ],
  "take": 20
}
```

## Payment Search

### Available Filters

1. **FieldFilterCondition** - Filter by payment fields
2. **TaggingFilterCondition** - Filter by payment tags
3. **IdFilterCondition** - Filter by payment ID

### Examples

#### 1. Find Payments by Reference Number

```json
{
  "filter": [
    {
      "$type": "Litium.Data.Queryable.Conditions.IdFilterCondition, Litium.Abstractions",
      "operator": "contains",
      "value": "PAY-"
    }
  ],
  "take": 20
}
```

#### 2. Find Payments by Tag

```json
{
  "filter": [
    {
      "$type": "Litium.Data.Queryable.Conditions.TaggingFilterCondition, Litium.Abstractions",
      "operator": "contains",
      "value": ["refunded"]
    }
  ],
  "take": 20
}
```

#### 3. Find Payments by Payment Method

```json
{
  "filter": [
    {
      "$type": "Litium.Data.Queryable.Conditions.FieldFilterCondition, Litium.Abstractions",
      "operator": "eq",
      "value": "CreditCard",
      "id": "PaymentMethod",
      "culture": "*"
    }
  ],
  "take": 20
}
```

## Transaction Search

### Available Filters

1. **FieldFilterCondition** - Filter by transaction fields
2. **TaggingFilterCondition** - Filter by transaction tags
3. **IdFilterCondition** - Filter by transaction ID

### Examples

#### 1. Find Transactions by Transaction ID

```json
{
  "filter": [
    {
      "$type": "Litium.Data.Queryable.Conditions.IdFilterCondition, Litium.Abstractions",
      "operator": "eq",
      "value": "TXN-12345"
    }
  ],
  "take": 20
}
```

#### 2. Find Transactions by Type

```json
{
  "filter": [
    {
      "$type": "Litium.Data.Queryable.Conditions.FieldFilterCondition, Litium.Abstractions",
      "operator": "eq",
      "value": "Capture",
      "id": "TransactionType",
      "culture": "*"
    }
  ],
  "take": 20
}
```

## GiftCard Search

### Available Filters

1. **FieldFilterCondition** - Filter by gift card fields
2. **IdFilterCondition** - Filter by gift card code

### Examples

#### 1. Find Gift Cards by Code

```json
{
  "filter": [
    {
      "$type": "Litium.Data.Queryable.Conditions.IdFilterCondition, Litium.Abstractions",
      "operator": "contains",
      "value": "GIFT"
    }
  ],
  "take": 20
}
```

#### 2. Find Active Gift Cards with Balance

```json
{
  "filter": [
    {
      "bool": {
        "must": [
          {
            "$type": "Litium.Data.Queryable.Conditions.FieldFilterCondition, Litium.Abstractions",
            "operator": "gt",
            "value": 0,
            "id": "Balance",
            "culture": "*"
          },
          {
            "$type": "Litium.Data.Queryable.Conditions.FieldFilterCondition, Litium.Abstractions",
            "operator": "eq",
            "value": true,
            "id": "IsActive",
            "culture": "*"
          }
        ]
      }
    }
  ],
  "take": 20
}
```

## ReturnAuthorization Search

### Available Filters

1. **FieldFilterCondition** - Filter by RMA fields
2. **IdFilterCondition** - Filter by RMA ID
3. **DateRangeFilterCondition** - Filter by date ranges

### Examples

#### 1. Find RMAs by Reference Number

```json
{
  "filter": [
    {
      "$type": "Litium.Data.Queryable.Conditions.IdFilterCondition, Litium.Abstractions",
      "operator": "contains",
      "value": "RMA-"
    }
  ],
  "take": 20
}
```

## Discount Search

### Available Filters

1. **FieldFilterCondition** - Filter by discount fields
2. **IdFilterCondition** - Filter by discount ID
3. **TemplateFilterCondition** - Filter by discount template

### Examples

#### 1. Find Discounts by Name

```json
{
  "filter": [
    {
      "$type": "Litium.Data.Queryable.Conditions.FieldFilterCondition, Litium.Abstractions",
      "operator": "contains",
      "value": "Summer Sale",
      "id": "Name",
      "culture": "en-US"
    }
  ],
  "take": 20
}
```

#### 2. Find Active Discounts

```json
{
  "filter": [
    {
      "$type": "Litium.Data.Queryable.Conditions.FieldFilterCondition, Litium.Abstractions",
      "operator": "eq",
      "value": true,
      "id": "IsActive",
      "culture": "*"
    }
  ],
  "take": 20
}
```

## Campaign Search

### Available Filters

1. **FieldFilterCondition** - Filter by campaign fields
2. **IdFilterCondition** - Filter by campaign ID
3. **TemplateFilterCondition** - Filter by campaign template
4. **DateRangeFilterCondition** - Filter by date ranges

### Examples

#### 1. Find Campaigns by Name

```json
{
  "filter": [
    {
      "$type": "Litium.Data.Queryable.Conditions.FieldFilterCondition, Litium.Abstractions",
      "operator": "contains",
      "value": "Holiday",
      "id": "Name",
      "culture": "en-US"
    }
  ],
  "take": 20
}
```

#### 2. Find Active Campaigns in Date Range

```json
{
  "filter": [
    {
      "bool": {
        "must": [
          {
            "$type": "Litium.Data.Queryable.Conditions.FieldFilterCondition, Litium.Abstractions",
            "operator": "eq",
            "value": true,
            "id": "IsActive",
            "culture": "*"
          },
          {
            "$type": "Litium.Data.Queryable.Conditions.DateRangeFilterCondition, Litium.Abstractions",
            "operator": "between",
            "fromDate": "2024-12-01T00:00:00Z",
            "toDate": "2024-12-31T23:59:59Z"
          }
        ]
      }
    }
  ],
  "take": 20
}
```

## Tagging Support

Only **Shipment**, **Payment**, and **Transaction** entities support tagging.

### Tag Operators

- `eq` - Exact tag match (all tags must match)
- `neq` - Not equal to tags
- `contains` - Contains any of the specified tags (OR logic)
- `not-contains` - Does not contain any of the specified tags
- `null` - Has no tags
- `any` - Has at least one tag

### Example: Find Shipments with Multiple Tags

```json
{
  "filter": [
    {
      "$type": "Litium.Data.Queryable.Conditions.TaggingFilterCondition, Litium.Abstractions",
      "operator": "eq",
      "value": ["urgent", "overnight"]
    }
  ],
  "take": 20
}
```

## Common Field IDs

### Shipment Fields
- `TrackingNumber` - Shipment tracking number
- `Carrier` - Shipping carrier
- `ShipmentDate` - Date shipped
- `DeliveryDate` - Expected delivery date
- `Status` - Shipment status

### Payment Fields
- `PaymentMethod` - Payment method used
- `Amount` - Payment amount
- `Currency` - Payment currency
- `Status` - Payment status
- `PaymentReference1` - External reference 1
- `PaymentReference2` - External reference 2

### Transaction Fields
- `TransactionType` - Type (Authorize, Capture, Refund, etc.)
- `Amount` - Transaction amount
- `TransactionDate` - Transaction date
- `TransactionReference1` - External reference 1
- `TransactionReference2` - External reference 2

### GiftCard Fields
- `Code` - Gift card code
- `Balance` - Current balance
- `IsActive` - Active status
- `ExpirationDate` - Expiration date

## Response Examples

### Shipment Response

```json
{
  "total": 156,
  "items": [
    {
      "systemId": "shipment-guid",
      "id": "SHIP-12345",
      "trackingNumber": "TRACK-ABC123",
      "orderSystemId": "order-guid",
      "tags": ["urgent", "priority"]
    }
  ]
}
```

### Payment Response

```json
{
  "total": 234,
  "items": [
    {
      "systemId": "payment-guid",
      "id": "PAY-67890",
      "paymentMethod": "CreditCard",
      "amount": 129.99,
      "currencyCode": "USD",
      "tags": ["verified"]
    }
  ]
}
```

## Tips

1. **Order Context**: To find shipments/payments for a specific order, use the Administration Application API
2. **Tags**: Use tagging for operational workflows (e.g., "needs-attention", "processed")
3. **Date Ranges**: Useful for reporting and historical queries
4. **Reference Numbers**: Use IdFilterCondition for external system references
5. **Pagination**: Sales entities can have large datasets, always use pagination

## Why No Order Search?

The AdminApi **intentionally excludes** Order entities because:

1. **No QueryFilterCondition Processor**: There's no registered processor for `OrderCustomerFilterCondition`
2. **Complex Filtering**: Order filtering requires specialized filter services not available in AdminApi
3. **Different API**: The Administration Application API (`/Litium/app/api/`) provides full order search capabilities

**For order searches, use:** `/Litium/app/api/sales/order/search`

See [Sales Order Search Workaround](./sales-order-search-workaround.md) for details.

## Related Documentation

- [AdminAPI Search Overview](./adminapi-search-overview.md)
- [Sales Order Search Workaround](./sales-order-search-workaround.md)
- [Products Search Guide](./adminapi-search-products.md)

