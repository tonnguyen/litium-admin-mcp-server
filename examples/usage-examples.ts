// Example usage of the Litium Admin MCP Server with separated services

import { LitiumApiService } from '../src/services/litium-api.js';
import { createLitiumConfig } from '../src/utils/config.js';

async function demonstrateUsage() {
  // Create configuration (in real usage, this would come from MCP tool parameters)
  const config = createLitiumConfig({
    baseUrl: 'https://demoadmin.litium.com',
    clientId: 'your_client_id_here',
    clientSecret: 'your_client_secret_here'
  });
  const api = new LitiumApiService(config);

  try {
    console.log('🚀 Litium Admin API Usage Examples\n');

    // 1. Content Blocks Management
    console.log('📦 Content Blocks:');
    const blocks = await api.blocks.searchBlocks({ 
      search: 'homepage', 
      take: 5 
    });
    console.log('Found blocks:', blocks);

    // Get a specific block
    if (blocks && blocks.length > 0) {
      const block = await api.blocks.getBlock(blocks[0].systemId);
      console.log('Block details:', block);
    }

    // 2. Products Management
    console.log('\n🛍️ Products:');
    const products = await api.products.searchBaseProducts({ 
      search: 'shirt', 
      take: 3 
    });
    console.log('Found products:', products);

    // Get product variants
    if (products && products.length > 0) {
      const variants = await api.products.getProductVariants(products[0].systemId);
      console.log('Product variants:', variants);
    }

    // 3. Customer Management
    console.log('\n👥 Customers:');
    const customers = await api.customers.searchCustomers({ 
      search: 'john', 
      take: 3 
    });
    console.log('Found customers:', customers);

    // Get customer groups
    const customerGroups = await api.customers.searchCustomerGroups({ take: 5 });
    console.log('Customer groups:', customerGroups);

    // 4. Media Management
    console.log('\n🖼️ Media Files:');
    const mediaFiles = await api.media.searchMediaFiles({ 
      search: 'image', 
      take: 3 
    });
    console.log('Found media files:', mediaFiles);

    // 5. Website Management
    console.log('\n🌐 Websites:');
    const websites = await api.websites.getWebsites();
    console.log('Websites:', websites);

    // 6. Orders Management
    console.log('\n📊 Orders:');
    const orders = await api.orders.searchSalesOrders({ 
      take: 3 
    });
    console.log('Found orders:', orders);

    // 7. Advanced Domain-Specific Operations
    console.log('\n🔧 Advanced Domain-Specific Operations:');
    
    // Get block categories
    const blockCategories = await api.blocks.getCategories({ take: 5 });
    console.log('Block categories:', blockCategories);

    // Get product assortments
    const assortments = await api.products.searchAssortments({ take: 3 });
    console.log('Product assortments:', assortments);

    // Get organizations
    const organizations = await api.customers.searchOrganizations({ take: 3 });
    console.log('Organizations:', organizations);

    // Get media folders
    const mediaFolders = await api.media.searchMediaFolders({ take: 3 });
    console.log('Media folders:', mediaFolders);

    // Get campaigns
    const campaigns = await api.orders.searchCampaigns({ take: 3 });
    console.log('Campaigns:', campaigns);

    console.log('\n✅ All examples completed successfully!');

  } catch (error) {
    console.error('❌ Error occurred:', error);
  }
}

// Run the examples if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  demonstrateUsage().catch(console.error);
}

export { demonstrateUsage };