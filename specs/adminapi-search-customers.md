# Litium Admin API - Customers Search Guide

## Overview

This guide covers searching customer-related entities in the Litium Admin Web API.

## Supported Entities

| Entity | Endpoint | Description |
|--------|----------|-------------|
| Person | `POST /Litium/api/admin/customers/persons/search` | Individual customers/persons |
| Organization | `POST /Litium/api/admin/customers/organizations/search` | Organizations/companies |
| TargetGroup | `POST /Litium/api/admin/customers/targetGroups/search` | Marketing target groups |

## Person Search

### Available Filters

1. **FieldFilterCondition** - Filter by person fields
2. **IdFilterCondition** - Filter by person ID/login
3. **TemplateFilterCondition** - Filter by field template

### Examples

#### 1. Find Persons by Name

```json
{
  "filter": [
    {
      "$type": "Litium.Data.Queryable.Conditions.FieldFilterCondition, Litium.Abstractions",
      "operator": "contains",
      "value": "Smith",
      "id": "LastName",
      "culture": "*"
    }
  ],
  "take": 20
}
```

#### 2. Find Persons by Email

```json
{
  "filter": [
    {
      "$type": "Litium.Data.Queryable.Conditions.FieldFilterCondition, Litium.Abstractions",
      "operator": "eq",
      "value": "john.smith@example.com",
      "id": "Email",
      "culture": "*"
    }
  ],
  "take": 20
}
```

#### 3. Find Persons by Login ID

```json
{
  "filter": [
    {
      "$type": "Litium.Data.Queryable.Conditions.IdFilterCondition, Litium.Abstractions",
      "operator": "contains",
      "value": "john"
    }
  ],
  "take": 20
}
```

#### 4. Find Persons by Phone Number

```json
{
  "filter": [
    {
      "$type": "Litium.Data.Queryable.Conditions.FieldFilterCondition, Litium.Abstractions",
      "operator": "contains",
      "value": "+1-555",
      "id": "Phone",
      "culture": "*"
    }
  ],
  "take": 20
}
```

#### 5. Complex Search: First and Last Name

```json
{
  "filter": [
    {
      "bool": {
        "must": [
          {
            "$type": "Litium.Data.Queryable.Conditions.FieldFilterCondition, Litium.Abstractions",
            "operator": "contains",
            "value": "John",
            "id": "FirstName",
            "culture": "*"
          },
          {
            "$type": "Litium.Data.Queryable.Conditions.FieldFilterCondition, Litium.Abstractions",
            "operator": "contains",
            "value": "Smith",
            "id": "LastName",
            "culture": "*"
          }
        ]
      }
    }
  ],
  "take": 20
}
```

## Organization Search

### Available Filters

1. **FieldFilterCondition** - Filter by organization fields
2. **IdFilterCondition** - Filter by organization ID
3. **TemplateFilterCondition** - Filter by field template

### Examples

#### 1. Find Organizations by Name

```json
{
  "filter": [
    {
      "$type": "Litium.Data.Queryable.Conditions.FieldFilterCondition, Litium.Abstractions",
      "operator": "contains",
      "value": "Tech",
      "id": "Name",
      "culture": "*"
    }
  ],
  "take": 20
}
```

#### 2. Find Organizations by Organization Number

```json
{
  "filter": [
    {
      "$type": "Litium.Data.Queryable.Conditions.FieldFilterCondition, Litium.Abstractions",
      "operator": "eq",
      "value": "ORG-12345",
      "id": "OrganizationNumber",
      "culture": "*"
    }
  ],
  "take": 20
}
```

#### 3. Find Organizations by Address

```json
{
  "filter": [
    {
      "$type": "Litium.Data.Queryable.Conditions.FieldFilterCondition, Litium.Abstractions",
      "operator": "contains",
      "value": "New York",
      "id": "City",
      "culture": "*"
    }
  ],
  "take": 20
}
```

## TargetGroup Search

### Available Filters

1. **FieldFilterCondition** - Filter by target group fields
2. **IdFilterCondition** - Filter by target group ID

### Examples

#### 1. Find Target Groups by Name

```json
{
  "filter": [
    {
      "$type": "Litium.Data.Queryable.Conditions.FieldFilterCondition, Litium.Abstractions",
      "operator": "contains",
      "value": "VIP",
      "id": "Name",
      "culture": "*"
    }
  ],
  "take": 20
}
```

#### 2. Find Target Groups by Description

```json
{
  "filter": [
    {
      "$type": "Litium.Data.Queryable.Conditions.FieldFilterCondition, Litium.Abstractions",
      "operator": "contains",
      "value": "frequent",
      "id": "Description",
      "culture": "en-US"
    }
  ],
  "take": 20
}
```

## Common Field IDs

### Person Fields
- `FirstName` - First name
- `LastName` - Last name
- `Email` - Email address
- `Phone` - Phone number
- `MobilePhone` - Mobile phone number
- `Address` - Street address
- `City` - City
- `ZipCode` - ZIP/Postal code
- `Country` - Country
- `DateOfBirth` - Date of birth
- `CustomerNumber` - Customer number

### Organization Fields
- `Name` - Organization name
- `OrganizationNumber` - Organization/VAT number
- `Email` - Organization email
- `Phone` - Organization phone
- `Address` - Street address
- `City` - City
- `ZipCode` - ZIP/Postal code
- `Country` - Country
- `Website` - Organization website

### TargetGroup Fields
- `Name` - Target group name
- `Description` - Target group description
- `Category` - Target group category

## Sorting

### Sort Persons by Last Name

```json
{
  "sort": [
    {
      "fieldId": "LastName",
      "direction": "Ascending"
    },
    {
      "fieldId": "FirstName",
      "direction": "Ascending"
    }
  ]
}
```

### Sort Organizations by Name

```json
{
  "sort": [
    {
      "fieldId": "Name",
      "direction": "Ascending"
    }
  ]
}
```

## Response Examples

### Person Response

```json
{
  "total": 1523,
  "items": [
    {
      "systemId": "person-guid",
      "id": "john.smith@example.com",
      "fields": {
        "FirstName": {
          "*": "John"
        },
        "LastName": {
          "*": "Smith"
        },
        "Email": {
          "*": "john.smith@example.com"
        },
        "Phone": {
          "*": "+1-555-1234"
        }
      },
      "organizationLinks": [
        {
          "organizationSystemId": "org-guid",
          "roleSystemIds": ["role-guid"]
        }
      ]
    }
  ]
}
```

### Organization Response

```json
{
  "total": 89,
  "items": [
    {
      "systemId": "org-guid",
      "id": "acme-corp",
      "fields": {
        "Name": {
          "*": "Acme Corporation"
        },
        "OrganizationNumber": {
          "*": "ORG-12345"
        },
        "Email": {
          "*": "info@acme.com"
        }
      },
      "addresses": [
        {
          "addressType": "billing",
          "address1": "123 Main St",
          "city": "New York",
          "zipCode": "10001",
          "country": "US"
        }
      ]
    }
  ]
}
```

## Complex Search Examples

### Find Persons in Specific City

```json
{
  "filter": [
    {
      "$type": "Litium.Data.Queryable.Conditions.FieldFilterCondition, Litium.Abstractions",
      "operator": "eq",
      "value": "Stockholm",
      "id": "City",
      "culture": "*"
    }
  ],
  "sort": [
    {
      "fieldId": "LastName",
      "direction": "Ascending"
    }
  ],
  "take": 100
}
```

### Find Organizations by Country

```json
{
  "filter": [
    {
      "$type": "Litium.Data.Queryable.Conditions.FieldFilterCondition, Litium.Abstractions",
      "operator": "eq",
      "value": "SE",
      "id": "Country",
      "culture": "*"
    }
  ],
  "take": 50
}
```

## Tips

1. **Email Search**: Use exact match (`eq`) for email lookups for better performance
2. **Name Search**: Use `contains` for flexible name searches
3. **Login ID**: Use IdFilterCondition to search by login username
4. **Phone Numbers**: Consider different formats when searching phone numbers
5. **Culture**: Most customer fields are culture-independent, use `"*"`
6. **Privacy**: Be mindful of data privacy regulations when querying customer data

## Limitations

1. **Password Fields**: Password and sensitive fields are not searchable
2. **Linked Data**: Search doesn't automatically include related persons/organizations
3. **Groups**: DynamicGroup, ContextualGroup, and StaticGroup are not searchable via AdminApi
4. **Access Control**: Results are filtered based on user permissions

## Use Cases

### Customer Support Lookup

```json
{
  "filter": [
    {
      "bool": {
        "should": [
          {
            "$type": "Litium.Data.Queryable.Conditions.FieldFilterCondition, Litium.Abstractions",
            "operator": "contains",
            "value": "search-term",
            "id": "Email",
            "culture": "*"
          },
          {
            "$type": "Litium.Data.Queryable.Conditions.FieldFilterCondition, Litium.Abstractions",
            "operator": "contains",
            "value": "search-term",
            "id": "LastName",
            "culture": "*"
          },
          {
            "$type": "Litium.Data.Queryable.Conditions.FieldFilterCondition, Litium.Abstractions",
            "operator": "contains",
            "value": "search-term",
            "id": "CustomerNumber",
            "culture": "*"
          }
        ]
      }
    }
  ],
  "take": 10
}
```

## Related Documentation

- [AdminAPI Search Overview](./adminapi-search-overview.md)
- [Sales Search Guide](./adminapi-search-sales.md)

