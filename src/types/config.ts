import { z } from 'zod';

export const LitiumConfigSchema = z.object({
  baseUrl: z.string().url('Base URL must be a valid URL'),
  clientId: z.string().min(1, 'Client ID is required'),
  clientSecret: z.string().min(1, 'Client Secret is required'),
});

export type LitiumConfig = z.infer<typeof LitiumConfigSchema>;

export interface MCPConfig {
  serverName: string;
  serverVersion: string;
}

export class ConfigError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ConfigError';
  }
}