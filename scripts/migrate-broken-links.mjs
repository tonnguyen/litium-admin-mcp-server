#!/usr/bin/env node

/**
 * Script to migrate broken links from legacy docs.litium.com
 * This script reads the broken-links-report.txt and creates placeholder pages
 * for the most common broken links.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DOCS_DIR = path.join(__dirname, '..', 'docs');
const BROKEN_LINKS_FILE = path.join(DOCS_DIR, 'broken-links-report.txt');

// Map of broken link patterns to new local paths
const linkMappings = {
  '/platform/areas/sales/state-transitions': '/platform/areas/sales/state-transitions',
  '/add-ons/add-ons-as-extensions/payment-extensions': '/platform/areas/sales/payment-extensions',
  '/resources/download-add-ons': '/platform/resources/download-add-ons',
  '/platform/guides/data-modelling/how-to-create-custom-field-types': '/platform/guides/data-modelling/how-to-create-custom-field-types',
  '/platform/guides/back-office-ui-extensions/how-to-create-a-custom-panel': '/platform/guides/back-office-ui-extensions/how-to-create-a-custom-panel',
  '/platform/areas/dashboard/how-to-create-custom-dashboard-widgets': '/platform/areas/dashboard/how-to-create-custom-dashboard-widgets',
  '/platform/guides/back-office-ui-extensions/display-dialogs': '/platform/guides/back-office-ui-extensions/display-dialogs',
  '/platform/apis/storefront-api/storefront-api-roadmap': '/apis/storefront/roadmap',
  '/add-ons/litium-apps/adyen-payment/docker-template': '/apps/adyen-payment/docker-template',
  '/add-ons/litium-apps/briqpay-payment/payment-flow': '/apps/briqpay-payment/payment-flow',
  '/add-ons/add-ons-as-extensions/payment-extensions/briqpay': '/apps/briqpay-payment/overview',
  '/cloud/serverless/get-started/install-payment-and-delivery-apps': '/cloud/serverless/install-payment-and-delivery-apps',
  '/platform/get-started/developer-tools/litium-cloud-cli': '/cloud/serverless/getting-started-with-cloud-cli',
  '/add-ons/litium-apps/klarna-payment': '/apps/klarna-payment/overview',
  '/add-ons/litium-apps/direct-shipment': '/apps/direct-shipment/overview',
  '/add-ons/litium-apps/briqpay-payment': '/apps/briqpay-payment/overview',
  '/cloud/serverless/apps/private-apps': '/cloud/serverless/private-apps-pricing',
  '/api-reference/net-api': '/apis/overview',
  '/platform/areas/websites-cms/create-a-web': '/platform/areas/websites-cms/overview',
  '/platform/areas/sales/order-placement/preorder-validation': '/platform/areas/sales/order-placement',
  '/add-ons/litium-apps/nshift-checkout/docker-template': '/apps/nshift-checkout/docker-template',
  '/platform/areas/products-pim/price-agents/field-mappings/shipping-data': '/platform/areas/products-pim/price-agents',
  '/add-ons/litium-apps/qliro-payment/docker-template': '/apps/qliro-payment/docker-template',
  '/platform/apis/connect-apis/domain-areas/payments-domain/business-processes/payment-tokens': '/platform/apis/connect-apis/domain-areas/payments-domain',
  '/add-ons/litium-apps/svea-payment/docker-template': '/apps/svea-payment/docker-template',
  '/resources/support': '/cloud/serverless/overview',
  '/platform/get-started/developer-tools/db-tool': '/platform/get-started/developer-tools',
  '/system_pages/login_ls': '/cloud/serverless/overview',
  '/resources/support/request-license': '/cloud/serverless/overview',
  '/platform/guides/upgrade-to-litium-8/upgrade-the-database': '/platform/guides/upgrade-to-litium-8/overview',
  '/cloud/serverless/get-started': '/cloud/serverless/overview',
  '/resources/price-list': '/cloud/serverless/private-apps-pricing',
  '/accelerators/react-accelerator': '/accelerators/react/overview',
  '/platform/architecture/job-scheduler': '/platform/architecture/overview',
  '/api-reference/connect-erp-api': '/apis/connect/overview',
  '/add-ons/get-started': '/apps/development-guide/overview',
  '/platform/areas/data-modelling/product-data-modeling': '/platform/areas/data-modelling/overview',
  '/platform/areas/data-modelling/websites-data-modeling': '/platform/areas/data-modelling/overview',
  '/platform/areas/globalization/globalization-configuration-scenarios': '/platform/areas/globalization/overview',
  '/platform/areas/sales/order-approval': '/platform/areas/sales/overview',
  '/platform/areas/customers/target-groups': '/platform/areas/customers/overview',
  '/platform/areas/data-modelling/gdpr-support': '/platform/areas/data-modelling/overview',
  '/platform/areas/data-modelling/customers-data-modeling': '/platform/areas/data-modelling/overview',
  '/platform/areas/data-modelling/media-data-modeling': '/platform/areas/data-modelling/overview',
  '/add-ons/add-ons-as-extensions/connectors-product-extensions/product-media-mapper': '/platform/areas/products-pim/overview',
  '/add-ons/add-ons-as-extensions/connectors-product-extensions/litium-integration-kit': '/platform/areas/products-pim/overview',
  '/platform/apis/storefront-api': '/apis/storefront/overview',
  '/platform/architecture/distributed-caching': '/platform/architecture/overview',
  '/platform/guides/upgrade-to-litium-8/upgrade-the-platform-solution/dotnet-upgrade': '/platform/guides/upgrade-to-litium-8/overview',
  '/platform/get-started/developer-introduction': '/platform/get-started/overview',
  '/platform/architecture/tagging': '/platform/architecture/overview',
  '/add-ons/add-ons-as-extensions/payment-extensions/klarna/develop': '/apps/klarna-payment/overview',
  '/platform/architecture/web-api/security': '/platform/architecture/web-api/overview',
};

// Create placeholder MDX files for common patterns
const createPlaceholderPages = () => {
  const placeholders = [
    {
      path: 'platform/resources/download-add-ons.mdx',
      title: 'Download Add-ons',
      description: 'Download Litium add-ons and extensions',
      content: `# Download Add-ons

Please login to access the partner information section or download releases and add-ons.

Partners and users need a Litium account to access downloads.

## Need an account?

[Register new account](https://docs.litium.com/system_pages/createlitiumaccount)

## Available Add-ons

For Litium 8, many add-ons are now available as [Litium Apps](/apps/overview).

Check the [Apps section](/apps/overview) for available payment providers, shipping integrations, and other extensions.
`
    },
    {
      path: 'platform/guides/back-office-ui-extensions/display-dialogs.mdx',
      title: 'Display Dialogs',
      description: 'How to display dialogs in Litium back office UI',
      content: `# Display Dialogs

Learn how to display dialogs and modal windows in the Litium back office UI.

## Overview

The Litium back office provides a dialog service for displaying modal dialogs and confirmation prompts.

## Usage

Dialogs can be used for:
- Confirmation prompts
- Custom forms
- Information messages
- Warning and error notifications

<Note>
This page is under construction. More details will be added soon.
</Note>
`
    },
    {
      path: 'apis/storefront/roadmap.mdx',
      title: 'Storefront API Roadmap',
      description: 'Litium Storefront API development roadmap',
      content: `# Storefront API Roadmap

The Storefront API roadmap outlines planned features and improvements.

<Note>
Please login to access the complete roadmap information.
</Note>

For current Storefront API documentation, see:
- [Storefront API Overview](/apis/storefront/overview)
- [Getting Started](/platform/get-started/configuration)
`
    }
  ];

  placeholders.forEach(({ path: filePath, title, description, content }) => {
    const fullPath = path.join(DOCS_DIR, filePath);
    const dir = path.dirname(fullPath);
    
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    
    if (!fs.existsSync(fullPath)) {
      const mdxContent = `---
title: "${title}"
description: "${description}"
---

${content}`;
      
      fs.writeFileSync(fullPath, mdxContent, 'utf8');
      console.log(`Created: ${filePath}`);
    }
  });
};

// Parse broken links report
const parseBrokenLinks = () => {
  if (!fs.existsSync(BROKEN_LINKS_FILE)) {
    console.error('Broken links report not found');
    return [];
  }

  const content = fs.readFileSync(BROKEN_LINKS_FILE, 'utf8');
  const lines = content.split('\n');
  const brokenLinks = new Map();

  lines.forEach(line => {
    const match = line.match(/⎿\s+(.+)/);
    if (match) {
      const link = match[1].trim();
      brokenLinks.set(link, (brokenLinks.get(link) || 0) + 1);
    }
  });

  return Array.from(brokenLinks.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 50); // Top 50 most common broken links
};

// Main execution
console.log('Creating placeholder pages...');
createPlaceholderPages();

console.log('\nTop broken links:');
const brokenLinks = parseBrokenLinks();
brokenLinks.slice(0, 20).forEach(([link, count]) => {
  console.log(`${count}x: ${link}`);
});

console.log('\nMigration script completed!');
