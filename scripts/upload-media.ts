import path from 'node:path';
import { createLitiumConfig } from '../src/utils/config';
import { LitiumApiService } from '../src/services/litium-api';

async function main() {
  const [filePath, folderSystemId, fieldTemplateSystemId, fileLabel] = process.argv.slice(2);

  if (!filePath || !folderSystemId || !fieldTemplateSystemId) {
    console.error('Usage: tsx scripts/upload-media.ts <filePath> <folderSystemId> <fieldTemplateSystemId> [fileLabel]');
    process.exit(1);
  }

  const baseUrl = process.env.LITIUM_BASE_URL || process.env.X_LITIUM_BASE_URL;
  const clientId = process.env.LITIUM_CLIENT_ID || process.env.X_LITIUM_CLIENT_ID;
  const clientSecret = process.env.LITIUM_CLIENT_SECRET || process.env.X_LITIUM_CLIENT_SECRET;

  if (!baseUrl || !clientId || !clientSecret) {
    console.error('Set LITIUM_BASE_URL, LITIUM_CLIENT_ID, and LITIUM_CLIENT_SECRET environment variables.');
    process.exit(1);
  }

  const config = createLitiumConfig({
    baseUrl,
    clientId,
    clientSecret,
  });

  const api = new LitiumApiService(config);
  const fileName = fileLabel ?? path.basename(filePath);

  const metadata = await api.media.createMediaFile({
    folderSystemId,
    fieldTemplateSystemId,
    fields: {
      '_nameInvariantCulture': {
        '*': fileName,
      },
    },
  });

  await api.media.uploadFile(metadata.systemId, {
    filePath,
    fileName,
  });

  console.log(JSON.stringify(metadata, null, 2));
}

main().catch((error) => {
  console.error('Upload failed:', error);
  process.exit(1);
});

