import { config } from 'dotenv';
import { ConfigSchema, type Config, ConfigError } from '../types/config.js';

// Load environment variables
config();

export function loadConfig(): Config {
  const rawConfig = {
    baseUrl: process.env.LITIUM_BASE_URL,
    clientId: process.env.LITIUM_CLIENT_ID,
    clientSecret: process.env.LITIUM_CLIENT_SECRET,
    serverName: process.env.MCP_SERVER_NAME,
    serverVersion: process.env.MCP_SERVER_VERSION,
  };

  try {
    return ConfigSchema.parse(rawConfig);
  } catch (error) {
    if (error instanceof Error) {
      throw new ConfigError(`Configuration validation failed: ${error.message}`);
    }
    throw new ConfigError('Unknown configuration error');
  }
}

export function validateConfig(): void {
  try {
    loadConfig();
  } catch (error) {
    console.error('❌ Configuration Error:');
    console.error(error instanceof Error ? error.message : 'Unknown error');
    console.error('\n📝 Please check your .env file and ensure all required variables are set:');
    console.error('   - LITIUM_BASE_URL');
    console.error('   - LITIUM_CLIENT_ID');
    console.error('   - LITIUM_CLIENT_SECRET');
    console.error('\n💡 You can copy .env.example to .env and fill in your values.');
    process.exit(1);
  }
}