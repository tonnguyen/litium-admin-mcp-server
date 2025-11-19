import path from 'node:path';
import { createLitiumConfig } from '../src/utils/config';
import { LitiumApiService } from '../src/services/litium-api';

async function main() {
  const [systemId, filePath, fileLabel] = process.argv.slice(2);

  if (!systemId || !filePath) {
    console.error('Usage: tsx scripts/upload-existing-media.ts <systemId> <filePath> [fileLabel]');
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

  await api.media.uploadFile(systemId, {
    filePath,
    fileName,
  });

  console.log(`Uploaded ${fileName} to media ${systemId}`);
}

main().catch((error) => {
  console.error('Upload failed:', error);
  process.exit(1);
});

