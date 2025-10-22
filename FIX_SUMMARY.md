# Fix Summary: 405 Method Not Allowed Error

## Issue
Users were experiencing a `405 Method Not Allowed` error when searching for customers and potentially other entities. The error was incorrectly labeled as an "AuthenticationError" but was actually an HTTP method mismatch.

### Error Details
```json
{
  "statusCode": 405,
  "name": "AuthenticationError"
}
```

## Root Cause
The Litium Admin API endpoints for search operations require **POST** requests with JSON body data, but the implementation was using **GET** requests with query parameters.

### Affected Endpoints
The following search endpoints were incorrectly using GET instead of POST:

1. **Customers Service** (`src/services/customers/customers-service.ts`):
   - `/Litium/api/admin/customers/people/search` - Customer search
   - `/Litium/api/admin/customers/groups/search` - Customer groups search
   - `/Litium/api/admin/customers/organizations/search` - Organizations search

2. **Orders Service** (`src/services/orders/orders-service.ts`):
   - `/Litium/api/admin/sales/campaigns/search` - Campaigns search
   - `/Litium/api/admin/sales/discounts/search` - Discounts search

3. **Media Service** (`src/services/media/media-service.ts`):
   - `/Litium/api/admin/media/files/search` - Media files search

## Solution
Changed all affected search methods from using `this.search()` (GET request) to `this.searchPost()` (POST request).

### Code Changes

#### Before (Incorrect)
```typescript
async searchCustomers(params?: {
  search?: string;
  skip?: number;
  take?: number;
  sort?: string;
}) {
  const endpoint = '/Litium/api/admin/customers/people/search';
  return this.search<any>(endpoint, params);  // ❌ Uses GET
}
```

#### After (Correct)
```typescript
async searchCustomers(params?: {
  search?: string;
  skip?: number;
  take?: number;
  sort?: string;
}) {
  const endpoint = '/Litium/api/admin/customers/people/search';
  return this.searchPost<any>(endpoint, params);  // ✅ Uses POST
}
```

## Technical Details

### BaseApiService Methods
The base API service provides two search methods:

1. **`search()`** - Uses GET with query parameters
   ```typescript
   // Query: ?search=term&skip=0&take=20
   GET /endpoint?search=term&skip=0&take=20
   ```

2. **`searchPost()`** - Uses POST with JSON body
   ```typescript
   POST /endpoint
   Content-Type: application/json
   
   {
     "search": "term",
     "skip": 0,
     "take": 20,
     "sort": ""
   }
   ```

### Litium API Convention
Most Litium Admin API search endpoints follow this pattern:
- Endpoints ending in `/search` typically use POST requests
- This differs from REST conventions where search might use GET
- The POST method allows for more complex search parameters in the body

## Files Modified
1. `src/services/customers/customers-service.ts`
   - `searchCustomers()` - Line 19
   - `searchCustomerGroups()` - Line 64
   - `searchOrganizations()` - Line 109

2. `src/services/orders/orders-service.ts`
   - `searchCampaigns()` - Line 199
   - `searchDiscounts()` - Line 220

3. `src/services/media/media-service.ts`
   - `searchMediaFiles()` - Line 19

4. `docs/guides/troubleshooting.mdx`
   - Added new "API Errors" section documenting the 405 error and solution

## Testing
After the fix, all search endpoints should work correctly:
- Customer search
- Customer groups search
- Organizations search
- Campaigns search
- Discounts search
- Media files search

## Prevention
To prevent similar issues in the future:

1. **API Documentation**: Ensure the Litium API documentation clearly specifies which endpoints use GET vs POST
2. **Consistent Pattern**: All search endpoints should use `searchPost()` unless explicitly documented otherwise
3. **Testing**: Test all search endpoints when implementing new services

## Related Endpoints
The following search endpoints were already correctly using POST:
- Products: `/Litium/api/admin/products/baseProducts/search`
- Sales Orders: `/Litium/api/admin/sales/salesOrders/search`
- Shipments: `/Litium/api/admin/sales/shipments/search`
- Payments: `/Litium/api/admin/sales/payments/search`

## Version
This fix should be included in version 1.0.1 or later.

