import { z } from 'zod';

export const ConfigSchema = z.object({
  baseUrl: z.string().url('Base URL must be a valid URL'),
  clientId: z.string().min(1, 'Client ID is required'),
  clientSecret: z.string().min(1, 'Client Secret is required'),
  serverName: z.string().default('litium-admin-mcp-server'),
  serverVersion: z.string().default('1.0.0'),
});

export type Config = z.infer<typeof ConfigSchema>;

export interface LitiumConfig {
  baseUrl: string;
  clientId: string;
  clientSecret: string;
  serverName: string;
  serverVersion: string;
}

export class ConfigError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ConfigError';
  }
}