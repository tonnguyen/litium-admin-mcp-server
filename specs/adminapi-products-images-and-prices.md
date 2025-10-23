# Litium Admin API - How to Get Product Images and Prices

## Overview

This guide explains how to retrieve product images and prices through the Litium Admin Web API.

## Product Images

### Understanding Image Storage

Product images are stored as **Guid references** in product fields, not as URLs. The typical flow is:

1. Search/Get a product → Returns `fields` containing image Guid(s)
2. Extract the image `systemId` (Guid) from the field
3. Use the Media File API to get the actual image URL

### Step 1: Get Product with Image Fields

When you search or fetch a product, image fields contain Guid values:

```http
POST /Litium/api/admin/products/baseProducts/search
```

**Request:**
```json
{
  "filter": [
    {
      "$type": "Litium.Data.Queryable.Conditions.IdFilterCondition, Litium.Abstractions",
      "operator": "eq",
      "value": "PRODUCT-001"
    }
  ],
  "take": 1
}
```

**Response Example:**
```json
{
  "total": 1,
  "items": [
    {
      "systemId": "12345678-1234-1234-1234-123456789abc",
      "id": "PRODUCT-001",
      "fields": {
        "*": {
          "_name": {
            "value": "My Product"
          },
          "_primaryImage": {
            "value": "98765432-9876-9876-9876-987654321def"
          },
          "_images": {
            "value": [
              "98765432-9876-9876-9876-987654321def",
              "11111111-2222-3333-4444-555555555555"
            ]
          }
        }
      }
    }
  ]
}
```

**Key Points:**
- Image field types (e.g., `ImagePointer`, `MultiImagePointer`) return `Guid` values
- Single image fields: `"value": "guid"`
- Multiple image fields: `"value": ["guid1", "guid2"]`
- The Guid is the `systemId` of a `File` entity in the Media area

### Step 2: Get Image URL

Use the Media File API to get the actual image URL:

```http
GET /Litium/api/admin/media/files/{imageSystemId}/download
```

**Example:**
```http
GET /Litium/api/admin/media/files/98765432-9876-9876-9876-987654321def/download
```

**Response:**
- Status: `302 Found` (redirect)
- Location header: The actual image URL
- The endpoint redirects to the image location (could be local path or CDN URL)

**Important:** This endpoint returns a **redirect**, not the image data directly. Your client should:
- Follow the redirect to get the image
- Or extract the `Location` header to get the URL

### Step 3: Get Media File Details (Optional)

If you need metadata about the image (filename, dimensions, etc.):

```http
GET /Litium/api/admin/media/files/{imageSystemId}
```

**Response:**
```json
{
  "systemId": "98765432-9876-9876-9876-987654321def",
  "id": "product-image.jpg",
  "name": "Product Image",
  "blobUri": "litium://media/...",
  "folderSystemId": "folder-guid",
  "fieldTemplateSystemId": "image-template-guid",
  "fields": {
    "*": {
      "_width": { "value": 1920 },
      "_height": { "value": 1080 },
      "_fileSize": { "value": 245678 }
    }
  }
}
```

### Complete Image Retrieval Example

```bash
# 1. Search for product
curl -X POST "https://your-site.com/Litium/api/admin/products/baseProducts/search" \
  -H "Content-Type: application/json" \
  -d '{"filter": [{"$type": "Litium.Data.Queryable.Conditions.IdFilterCondition, Litium.Abstractions", "operator": "eq", "value": "PRODUCT-001"}], "take": 1}'

# Extract imageSystemId from response: "98765432-9876-9876-9876-987654321def"

# 2. Get image URL (will redirect)
curl -L "https://your-site.com/Litium/api/admin/media/files/98765432-9876-9876-9876-987654321def/download"
```

### Common Image Field IDs

Typical field IDs used for product images (varies by implementation):

- `_primaryImage` - Primary product image
- `_images` - Additional product images
- `_thumbnail` - Thumbnail image
- `_galleryImages` - Gallery images
- `_variantImage` - Variant-specific image

## Product Prices

### Understanding Price Structure

Prices in Litium are stored in **Price Lists**:

1. **Price List** - Container for prices (e.g., "Standard Prices", "Campaign Prices")
2. **Price List Items** - Individual variant prices within a price list
3. Each price item contains: `VariantSystemId`, `MinimumQuantity`, `Price`

### Step 1: Find Price Lists

Search for available price lists:

```http
POST /Litium/api/admin/products/productPriceLists/search
```

**Request:**
```json
{
  "take": 100
}
```

**Response:**
```json
{
  "total": 3,
  "items": [
    {
      "systemId": "pricelist-guid-1",
      "id": "standard-prices",
      "fields": {
        "*": {
          "_name": {
            "value": "Standard Prices"
          },
          "_description": {
            "value": "Regular pricing"
          }
        }
      }
    }
  ]
}
```

### Step 2: Get Prices from a Price List

Retrieve all prices in a price list:

```http
GET /Litium/api/admin/products/productPriceLists/{priceListSystemId}/items
```

**Example:**
```http
GET /Litium/api/admin/products/productPriceLists/pricelist-guid-1/items
```

**Response:**
```json
[
  {
    "variantSystemId": "variant-guid-1",
    "minimumQuantity": 1.0,
    "price": 99.99
  },
  {
    "variantSystemId": "variant-guid-1",
    "minimumQuantity": 10.0,
    "price": 89.99
  },
  {
    "variantSystemId": "variant-guid-2",
    "minimumQuantity": 1.0,
    "price": 149.99
  }
]
```

**Key Points:**
- `variantSystemId` - The variant's system identifier
- `minimumQuantity` - Minimum quantity for this price tier
- `price` - The price for this tier
- Multiple entries per variant = volume/tier pricing

### Step 3: Match Prices to Variants

To get prices for specific products:

```javascript
// 1. Search for products/variants
const products = await searchProducts();

// 2. Get price list items
const priceListId = "pricelist-guid-1";
const priceItems = await getPriceListItems(priceListId);

// 3. Create price lookup map
const priceMap = {};
priceItems.forEach(item => {
  if (!priceMap[item.variantSystemId]) {
    priceMap[item.variantSystemId] = [];
  }
  priceMap[item.variantSystemId].push({
    minimumQuantity: item.minimumQuantity,
    price: item.price
  });
});

// 4. Match prices to products
products.items.forEach(product => {
  const prices = priceMap[product.systemId];
  if (prices) {
    product.prices = prices.sort((a, b) => a.minimumQuantity - b.minimumQuantity);
    product.basePrice = prices.find(p => p.minimumQuantity === 1)?.price;
  }
});
```

### Get Prices for Specific Variants

If you only need prices for specific variants, filter after retrieval:

```javascript
const variantSystemIds = ["variant-guid-1", "variant-guid-2"];
const allPrices = await getPriceListItems(priceListSystemId);

const filteredPrices = allPrices.filter(item => 
  variantSystemIds.includes(item.variantSystemId)
);
```

### Update Prices

You can update all prices in a price list:

```http
PUT /Litium/api/admin/products/productPriceLists/{priceListSystemId}/items
```

**Request:**
```json
[
  {
    "variantSystemId": "variant-guid-1",
    "minimumQuantity": 1.0,
    "price": 99.99
  },
  {
    "variantSystemId": "variant-guid-1",
    "minimumQuantity": 10.0,
    "price": 89.99
  }
]
```

**Important:** This is a **full replacement** operation:
- All existing prices in the price list are replaced
- Variants not in the request will have their prices removed
- To keep existing prices, include them in the request

## Complete Product + Images + Prices Example

Here's a complete workflow to get products with images and prices:

```javascript
async function getProductsWithImagesAndPrices() {
  // 1. Search for products
  const productResponse = await fetch('/Litium/api/admin/products/variants/search', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      filter: [
        {
          "$type": "Litium.Data.Queryable.Conditions.FieldFilterCondition, Litium.Abstractions",
          "operator": "eq",
          "value": true,
          "id": "_showOnWebsite",
          "culture": "*"
        }
      ],
      take: 50
    })
  });
  const products = await productResponse.json();

  // 2. Get price list
  const priceListId = "your-price-list-guid";
  const priceResponse = await fetch(
    `/Litium/api/admin/products/productPriceLists/${priceListId}/items`
  );
  const prices = await priceResponse.json();

  // 3. Create price lookup
  const priceMap = {};
  prices.forEach(item => {
    priceMap[item.variantSystemId] = item.price;
  });

  // 4. Enrich products with images and prices
  const enrichedProducts = await Promise.all(
    products.items.map(async (product) => {
      // Get image URL
      let imageUrl = null;
      const imageId = product.fields?.['*']?._image?.value;
      if (imageId) {
        const imageResponse = await fetch(
          `/Litium/api/admin/media/files/${imageId}/download`,
          { redirect: 'manual' }
        );
        imageUrl = imageResponse.headers.get('Location');
      }

      return {
        systemId: product.systemId,
        id: product.id,
        name: product.fields?.['*']?._name?.value,
        price: priceMap[product.systemId] || null,
        imageUrl: imageUrl
      };
    })
  );

  return enrichedProducts;
}
```

## Best Practices

### Images

1. **Cache Image URLs**: Once you have the download URL, cache it to avoid repeated API calls
2. **Handle Missing Images**: Always check if image fields exist before accessing them
3. **Batch Processing**: If you need many images, consider parallel requests (with rate limiting)
4. **Image Variants**: Products may have multiple images (primary, gallery, thumbnails) - decide which to use

### Prices

1. **Cache Price Lists**: Price lists change infrequently, cache the entire list
2. **Handle Missing Prices**: Not all variants may have prices in all price lists
3. **Volume Pricing**: Check `minimumQuantity` to support tier pricing
4. **Multiple Price Lists**: Products may have different prices in different markets/channels
5. **Price List Selection**: Determine which price list to use based on:
   - Customer segment
   - Channel
   - Market
   - Campaign dates

## Common Patterns

### Get Base Product with All Variant Prices

```http
# 1. Get base product
GET /Litium/api/admin/products/baseProducts/{baseProductSystemId}

# 2. Get all variants
GET /Litium/api/admin/products/baseProducts/{baseProductSystemId}/variants
Returns: ["variant-guid-1", "variant-guid-2"]

# 3. Get variant details
POST /Litium/api/admin/products/variants/search
{
  "filter": [{
    "$type": "Litium.Data.Queryable.Conditions.IdFilterCondition, Litium.Abstractions",
    "operator": "contains",
    "value": ["variant-guid-1", "variant-guid-2"]
  }]
}

# 4. Get prices for all variants
GET /Litium/api/admin/products/productPriceLists/{priceListSystemId}/items
```

### Get Image Dimensions Before Download

```http
# 1. Get file metadata
GET /Litium/api/admin/media/files/{imageSystemId}

# 2. Check dimensions from response
{
  "fields": {
    "*": {
      "_width": { "value": 1920 },
      "_height": { "value": 1080 }
    }
  }
}

# 3. Download if appropriate size
GET /Litium/api/admin/media/files/{imageSystemId}/download
```

## Performance Tips

1. **Batch Image Requests**: Request multiple images in parallel (with rate limiting)
2. **Price List Caching**: Cache entire price lists, don't request per-product
3. **Use Appropriate Take/Skip**: Don't fetch all products at once if you have thousands
4. **Field Filtering**: If possible, only request fields you need (check QueryOptions support)
5. **CDN Integration**: Consider setting up CDN for media files to reduce API load

## Troubleshooting

### Image Returns 404

- Verify the image `systemId` is correct
- Check if the file exists: `GET /Litium/api/admin/media/files/{systemId}`
- Verify the file is in the Media area, not deleted

### Price Returns Empty Array

- Verify the price list `systemId` is correct
- Check if prices exist for your variants
- Verify the price list contains items: might be an empty price list

### Image Field Returns Null

- Check if the product has an image assigned
- Verify the field ID is correct (e.g., `_primaryImage` vs `_image`)
- Check if the culture is correct (some fields are culture-specific)

### Wrong Price List

- Make sure you're using the correct price list for your context
- Different channels/markets may use different price lists
- Check price list validity dates if applicable

## Related Documentation

- [AdminAPI Search Overview](./adminapi-search-overview.md)
- [Products Search Guide](./adminapi-search-products.md)
- [Media Search Guide](./adminapi-search-media.md)

