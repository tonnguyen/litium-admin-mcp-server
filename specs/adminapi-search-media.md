# Litium Admin API - Media Search Guide

## Overview

This guide covers searching media entities (files and folders) in the Litium Admin Web API.

## Supported Entities

| Entity | Endpoint | Description |
|--------|----------|-------------|
| File | `POST /Litium/api/admin/media/files/search` | Media files (images, documents, videos, etc.) |
| Folder | `POST /Litium/api/admin/media/folders/search` | Media folders |

## Available Filters

1. **FieldFilterCondition** - Filter by file/folder fields
2. **IdFilterCondition** - Filter by file/folder ID
3. **TemplateFilterCondition** - Filter by template

## File Search

### Example 1: Find Files by Name

```json
{
  "filter": [
    {
      "$type": "Litium.Data.Queryable.Conditions.FieldFilterCondition, Litium.Abstractions",
      "operator": "contains",
      "value": "logo",
      "id": "FileName",
      "culture": "*"
    }
  ],
  "take": 20
}
```

### Example 2: Find Files by Extension/Type

```json
{
  "filter": [
    {
      "$type": "Litium.Data.Queryable.Conditions.IdFilterCondition, Litium.Abstractions",
      "operator": "contains",
      "value": ".jpg"
    }
  ],
  "take": 20
}
```

### Example 3: Find Files by Description

```json
{
  "filter": [
    {
      "$type": "Litium.Data.Queryable.Conditions.FieldFilterCondition, Litium.Abstractions",
      "operator": "contains",
      "value": "product",
      "id": "Description",
      "culture": "en-US"
    }
  ],
  "take": 20
}
```

### Example 4: Find Images Only

```json
{
  "filter": [
    {
      "bool": {
        "should": [
          {
            "$type": "Litium.Data.Queryable.Conditions.IdFilterCondition, Litium.Abstractions",
            "operator": "contains",
            "value": ".jpg"
          },
          {
            "$type": "Litium.Data.Queryable.Conditions.IdFilterCondition, Litium.Abstractions",
            "operator": "contains",
            "value": ".png"
          },
          {
            "$type": "Litium.Data.Queryable.Conditions.IdFilterCondition, Litium.Abstractions",
            "operator": "contains",
            "value": ".gif"
          }
        ]
      }
    }
  ],
  "take": 20
}
```

### Example 5: Find Files by Template

```json
{
  "filter": [
    {
      "$type": "Litium.Data.Queryable.Conditions.TemplateFilterCondition, Litium.Abstractions",
      "operator": "eq",
      "value": "ImageFile"
    }
  ],
  "take": 20
}
```

## Folder Search

### Example 1: Find Folders by Name

```json
{
  "filter": [
    {
      "$type": "Litium.Data.Queryable.Conditions.FieldFilterCondition, Litium.Abstractions",
      "operator": "contains",
      "value": "products",
      "id": "FolderName",
      "culture": "*"
    }
  ],
  "take": 20
}
```

### Example 2: Find Root Folders

```json
{
  "filter": [
    {
      "$type": "Litium.Data.Queryable.Conditions.IdFilterCondition, Litium.Abstractions",
      "operator": "starts-with",
      "value": "root-"
    }
  ],
  "take": 20
}
```

## Common Field IDs

### File Fields
- `FileName` - File name
- `Description` - File description
- `AltText` - Alternative text for images
- `Title` - File title
- `FileSize` - File size in bytes
- `MimeType` - MIME type
- `Tags` - File tags

### Folder Fields
- `FolderName` - Folder name
- `Description` - Folder description

## Sorting

### Sort Files by Name

```json
{
  "filter": [],
  "sort": [
    {
      "fieldId": "FileName",
      "direction": "Ascending"
    }
  ],
  "take": 20
}
```

### Sort Files by Upload Date

```json
{
  "sort": [
    {
      "fieldId": "UploadDate",
      "direction": "Descending"
    }
  ]
}
```

## Response Examples

### File Response

```json
{
  "total": 234,
  "items": [
    {
      "systemId": "file-guid",
      "id": "logo.png",
      "fields": {
        "FileName": {
          "*": "logo.png"
        },
        "Description": {
          "en-US": "Company logo"
        },
        "AltText": {
          "en-US": "Company Logo"
        }
      },
      "folderSystemId": "folder-guid",
      "blobUri": "https://cdn.example.com/files/logo.png"
    }
  ]
}
```

### Folder Response

```json
{
  "total": 45,
  "items": [
    {
      "systemId": "folder-guid",
      "id": "products",
      "fields": {
        "FolderName": {
          "*": "Product Images"
        },
        "Description": {
          "en-US": "Images for all products"
        }
      },
      "parentFolderSystemId": "parent-folder-guid"
    }
  ]
}
```

## Complex Search Examples

### Find JPG Images with Specific Text in Description

```json
{
  "filter": [
    {
      "bool": {
        "must": [
          {
            "$type": "Litium.Data.Queryable.Conditions.IdFilterCondition, Litium.Abstractions",
            "operator": "contains",
            "value": ".jpg"
          },
          {
            "$type": "Litium.Data.Queryable.Conditions.FieldFilterCondition, Litium.Abstractions",
            "operator": "contains",
            "value": "product",
            "id": "Description",
            "culture": "en-US"
          }
        ]
      }
    }
  ],
  "sort": [
    {
      "fieldId": "FileName",
      "direction": "Ascending"
    }
  ],
  "take": 50
}
```

## Tips

1. **File Extensions**: Use IdFilterCondition with `contains` to filter by file extension
2. **Culture for File Names**: Use `"*"` for culture as file names are usually culture-independent
3. **MIME Types**: Filter by MimeType field for precise file type matching
4. **Folder Hierarchy**: Search doesn't automatically include subfolders - filter by parent folder if needed
5. **Performance**: Index large media libraries and use specific filters

## Common Use Cases

### 1. Find All Images

```json
{
  "filter": [
    {
      "$type": "Litium.Data.Queryable.Conditions.FieldFilterCondition, Litium.Abstractions",
      "operator": "starts-with",
      "value": "image/",
      "id": "MimeType",
      "culture": "*"
    }
  ],
  "take": 100
}
```

### 2. Find Orphaned Files (No Description)

```json
{
  "filter": [
    {
      "$type": "Litium.Data.Queryable.Conditions.FieldFilterCondition, Litium.Abstractions",
      "operator": "eq",
      "value": "",
      "id": "Description",
      "culture": "en-US"
    }
  ],
  "take": 100
}
```

### 3. Find Large Files (if size field is searchable)

```json
{
  "filter": [
    {
      "$type": "Litium.Data.Queryable.Conditions.FieldFilterCondition, Litium.Abstractions",
      "operator": "gt",
      "value": 1048576,
      "id": "FileSize",
      "culture": "*"
    }
  ],
  "take": 20
}
```

## Limitations

1. **Binary Content**: Search is based on metadata only, not file contents
2. **Folder Depth**: No built-in recursive folder search
3. **Access Control**: Results filtered by user permissions
4. **File Types**: Some specialized file types may have limited metadata

## Related Documentation

- [AdminAPI Search Overview](./adminapi-search-overview.md)
- [Products Search Guide](./adminapi-search-products.md)

