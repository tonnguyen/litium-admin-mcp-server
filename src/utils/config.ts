import { LitiumConfigSchema, type LitiumConfig, type MCPConfig, ConfigError } from '../types/config.js';

export function createLitiumConfig(config: LitiumConfig): LitiumConfig {
  try {
    return LitiumConfigSchema.parse(config);
  } catch (error) {
    if (error instanceof Error) {
      throw new ConfigError(`Litium configuration validation failed: ${error.message}`);
    }
    throw new ConfigError('Unknown configuration error');
  }
}

export function createMCPConfig(): MCPConfig {
  return {
    serverName: 'litium-admin-mcp-server',
    serverVersion: '1.0.0',
  };
}