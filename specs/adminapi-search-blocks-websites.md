# Litium Admin API - Blocks & Websites Search Guide

## Blocks Area

### Supported Entities

| Entity | Endpoint | Description |
|--------|----------|-------------|
| Block | `POST /Litium/api/admin/blocks/blocks/search` | Published content blocks |
| DraftBlock | `POST /Litium/api/admin/blocks/draftBlocks/search` | Draft content blocks |

### Available Filters

1. **FieldFilterCondition** - Filter by block fields
2. **IdFilterCondition** - Filter by block ID
3. **TemplateFilterCondition** - Filter by block template

### Block Search Examples

#### 1. Find Blocks by Name

```json
{
  "filter": [
    {
      "$type": "Litium.Data.Queryable.Conditions.FieldFilterCondition, Litium.Abstractions",
      "operator": "contains",
      "value": "Header",
      "id": "BlockName",
      "culture": "en-US"
    }
  ],
  "take": 20
}
```

#### 2. Find Blocks by Template

```json
{
  "filter": [
    {
      "$type": "Litium.Data.Queryable.Conditions.TemplateFilterCondition, Litium.Abstractions",
      "operator": "eq",
      "value": "HeroBlock"
    }
  ],
  "take": 20
}
```

#### 3. Find Draft Blocks Modified Recently

Use DraftBlock endpoint for drafts:
```
POST /Litium/api/admin/blocks/draftBlocks/search
```

```json
{
  "filter": [
    {
      "$type": "Litium.Data.Queryable.Conditions.FieldFilterCondition, Litium.Abstractions",
      "operator": "contains",
      "value": "Banner",
      "id": "BlockName",
      "culture": "en-US"
    }
  ],
  "take": 20
}
```

## Websites Area

### Supported Entities

| Entity | Endpoint | Description |
|--------|----------|-------------|
| Page | `POST /Litium/api/admin/websites/pages/search` | Published website pages |
| DraftPage | `POST /Litium/api/admin/websites/draftPages/search` | Draft website pages |
| Website | `POST /Litium/api/admin/websites/websites/search` | Website configurations |
| UrlRedirect | `POST /Litium/api/admin/websites/urlRedirects/search` | URL redirects |

### Available Filters

1. **FieldFilterCondition** - Filter by page/website fields
2. **IdFilterCondition** - Filter by page/website ID
3. **TemplateFilterCondition** - Filter by page template
4. **ChannelFilterCondition** - Filter by channel (for pages)

### Page Search Examples

#### 1. Find Pages by Title

```json
{
  "filter": [
    {
      "$type": "Litium.Data.Queryable.Conditions.FieldFilterCondition, Litium.Abstractions",
      "operator": "contains",
      "value": "About",
      "id": "Title",
      "culture": "en-US"
    }
  ],
  "take": 20
}
```

#### 2. Find Pages by Template

```json
{
  "filter": [
    {
      "$type": "Litium.Data.Queryable.Conditions.TemplateFilterCondition, Litium.Abstractions",
      "operator": "eq",
      "value": "ArticlePage"
    }
  ],
  "take": 20
}
```

#### 3. Find Pages by URL Segment

```json
{
  "filter": [
    {
      "$type": "Litium.Data.Queryable.Conditions.IdFilterCondition, Litium.Abstractions",
      "operator": "contains",
      "value": "products"
    }
  ],
  "take": 20
}
```

#### 4. Find Pages by Channel

```json
{
  "filter": [
    {
      "$type": "Litium.Data.Queryable.Conditions.ChannelFilterCondition, Litium.Abstractions",
      "operator": "eq",
      "value": "channel-guid"
    }
  ],
  "take": 20
}
```

#### 5. Complex Search: Pages by Title and Template

```json
{
  "filter": [
    {
      "bool": {
        "must": [
          {
            "$type": "Litium.Data.Queryable.Conditions.FieldFilterCondition, Litium.Abstractions",
            "operator": "contains",
            "value": "News",
            "id": "Title",
            "culture": "en-US"
          },
          {
            "$type": "Litium.Data.Queryable.Conditions.TemplateFilterCondition, Litium.Abstractions",
            "operator": "eq",
            "value": "NewsPage"
          }
        ]
      }
    }
  ],
  "sort": [
    {
      "fieldId": "PublishDate",
      "direction": "Descending"
    }
  ],
  "take": 20
}
```

### Website Search Examples

#### 1. Find Websites by Name

```json
{
  "filter": [
    {
      "$type": "Litium.Data.Queryable.Conditions.FieldFilterCondition, Litium.Abstractions",
      "operator": "contains",
      "value": "Corporate",
      "id": "Name",
      "culture": "en-US"
    }
  ],
  "take": 20
}
```

### URL Redirect Search Examples

#### 1. Find Redirects by Original URL

```json
{
  "filter": [
    {
      "$type": "Litium.Data.Queryable.Conditions.IdFilterCondition, Litium.Abstractions",
      "operator": "contains",
      "value": "/old-page"
    }
  ],
  "take": 20
}
```

**Note:** UrlRedirect has limited field support. Use IdFilterCondition for URL-based searches.

## Draft vs Published Content

### Published Content
- Use `blocks/blocks/search` for published blocks
- Use `websites/pages/search` for published pages

### Draft Content
- Use `blocks/draftBlocks/search` for draft blocks
- Use `websites/draftPages/search` for draft pages

**Key Difference:** Draft entities are separate from published entities and have their own system IDs.

## Common Field IDs

### Blocks
- `BlockName` - Block name
- `BlockContent` - Block content
- `BlockType` - Block type

### Pages
- `Title` - Page title
- `Description` - Meta description
- `Keywords` - Meta keywords
- `Heading` - Page heading
- `Content` - Page content
- `PublishDate` - Publication date
- `Author` - Page author

### Websites
- `Name` - Website name
- `Description` - Website description
- `Domain` - Primary domain

## Sorting

```json
{
  "sort": [
    {
      "fieldId": "Title",
      "direction": "Ascending"
    }
  ]
}
```

## Response Examples

### Page Response
```json
{
  "total": 45,
  "items": [
    {
      "systemId": "page-guid",
      "id": "about-us",
      "fields": {
        "Title": {
          "en-US": "About Us"
        },
        "Content": {
          "en-US": "Welcome to our company..."
        }
      },
      "websiteSystemId": "website-guid",
      "parentPageSystemId": "parent-guid"
    }
  ]
}
```

### Block Response
```json
{
  "total": 12,
  "items": [
    {
      "systemId": "block-guid",
      "id": "header-block",
      "fields": {
        "BlockName": {
          "en-US": "Site Header"
        }
      },
      "fieldTemplateSystemId": "template-guid"
    }
  ]
}
```

## Tips

1. **Draft Search**: Remember draft entities are separate from published ones
2. **Template Filtering**: Useful for finding pages/blocks of a specific type
3. **Channel Filtering**: Filter pages by website channel
4. **URL Patterns**: Use IdFilterCondition to search by URL segments
5. **Localized Content**: Always specify culture for localized fields

## Limitations

1. **UrlRedirect**: Limited to basic ID-based filtering (no custom fields)
2. **Access Control**: Results are filtered based on user permissions
3. **Nested Structures**: Search doesn't traverse page hierarchies automatically

## Related Documentation

- [AdminAPI Search Overview](./adminapi-search-overview.md)
- [Products Search Guide](./adminapi-search-products.md)

