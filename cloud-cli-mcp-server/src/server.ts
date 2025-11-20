#!/usr/bin/env node
import express from 'express';
import { createServer } from 'node:http';
import { URL } from 'node:url';
import { WebSocketServer } from 'ws';
import { invokeCloudCliTool } from './tools/cloudCliTools.js';
import { execCli } from './cli/exec.js';
import { streamJobLogs } from './logs/logStreamer.js';

const app = express();
app.use(express.json({ limit: '1mb' }));

type LogLevel = 'trace' | 'debug' | 'info' | 'warn' | 'error';
const LOG_LEVELS: LogLevel[] = ['trace', 'debug', 'info', 'warn', 'error'];
let currentLogLevel: LogLevel = process.env.MCP_LOG_LEVEL as LogLevel || 'info';

function normalizeLogLevel(level: unknown): LogLevel | undefined {
  if (typeof level !== 'string') {
    return undefined;
  }
  const normalized = level.toLowerCase() as LogLevel;
  return LOG_LEVELS.includes(normalized) ? normalized : undefined;
}

// Basic health & CLI auth check
app.get('/health', async (_req, res) => {
  const check = await execCli({ args: ['subscription', 'list', '-o', 'json'], timeoutMs: 10_000 });
  if (check.ok) {
    res.json({ ok: true, cli: 'available', auth: 'ok' });
  } else if (check.errorCode === 'auth_required') {
    res.status(401).json({ ok: false, error: { code: 'auth_required', message: 'Run `litium-cloud auth login`' } });
  } else {
    res.status(500).json({ ok: false, error: { code: check.errorCode || 'cli_error', message: check.errorMessage } });
  }
});

// MCP protocol handler
app.post('/mcp', async (req, res) => {
  const body = req.body;
  console.log('[MCP] Received request:', body.method, body.id);
  
  // Handle MCP initialize
  if (body.method === 'initialize') {
    const response = {
      jsonrpc: '2.0',
      id: body.id,
      result: {
        protocolVersion: '2024-11-05',
        capabilities: {
          tools: {},
          logging: {
            supportsSetLevel: true,
            levels: LOG_LEVELS
          }
        },
        serverInfo: {
          name: 'litium-cloud-cli',
          version: '0.1.0'
        }
      }
    };
    console.log('[MCP] Sending initialize response');
    return res.json(response);
  }

  if (body.method === 'logging/setLevel') {
    const requestedLevel = normalizeLogLevel(body?.params?.level);
    if (!requestedLevel) {
      return res.json({
        jsonrpc: '2.0',
        id: body.id,
        error: {
          code: -32602,
          message: 'Invalid log level',
          data: { supportedLevels: LOG_LEVELS }
        }
      });
    }

    currentLogLevel = requestedLevel;
    console.log('[MCP] Log level set to', requestedLevel);

    return res.json({
      jsonrpc: '2.0',
      id: body.id,
      result: {
        level: currentLogLevel
      }
    });
  }
  
  // Handle MCP notifications
  if (body.method === 'notifications/initialized' || body.method === 'initialized') {
    return res.status(204).send();
  }
  
  // Handle tools/list
  if (body.method === 'tools/list') {
    return res.json({
      jsonrpc: '2.0',
      id: body.id,
      result: {
        tools: [
          {
            name: 'cloud_cli',
            description: 'Execute Litium Cloud CLI operations',
            inputSchema: {
              type: 'object',
              properties: {
                action: {
                  type: 'string',
                  description: 'The action to perform',
                  enum: [
                    'set_context', 'show_context',
                    'list_subscriptions', 'subscription_show', 'list_environments',
                    'deploy_app', 'job_status', 'job_logs_snapshot', 'console_output',
                    'artifact_list', 'artifact_show', 'artifact_create', 'artifact_type_list',
                    'marketplace_list', 'manifest_generate', 'app_list',
                    'secret_create', 'secret_list',
                    'access_control_show', 'access_control_add', 'access_control_remove', 'access_control_disable_inheritance',
                    'role_list', 'role_show',
                    'service_principal_create',
                    'get_audit_logs', 'apply_manifest'
                  ]
                },
                subscriptionId: {
                  type: 'string',
                  description: 'Subscription ID (required for subscription_show, optional for other actions)'
                },
                environmentId: {
                  type: 'string',
                  description: 'Environment ID (optional, used by various actions)'
                },
                cliUrl: {
                  type: 'string',
                  description: 'CLI URL to use.'
                },
                appId: {
                  type: 'string',
                  description: 'App ID (required for deploy_app, console_output)'
                },
                artifactId: {
                  type: 'string',
                  description: 'Artifact ID (required for deploy_app, artifact_show)'
                },
                jobId: {
                  type: 'string',
                  description: 'Job ID (required for job_status, job_logs_snapshot)'
                },
                filePath: {
                  type: 'string',
                  description: 'File path (required for artifact_create, service_principal_create, apply_manifest)'
                },
                artifactType: {
                  type: 'string',
                  enum: ['litium-db-tool', 'script-result', 'db-migration', 'sqlbackup', 'storage', 'dotnet', 'nextjs', 'nodejs', 'nuxtjs', 'redisbackup'],
                  description: 'Artifact type (required for artifact_create)'
                },
                filter: {
                  type: 'string',
                  description: 'Filter string (optional for marketplace_list)'
                },
                details: {
                  type: 'boolean',
                  description: 'Show details (optional for marketplace_list)'
                },
                scope: {
                  type: 'string',
                  enum: ['subscription', 'environment'],
                  description: 'Scope (required for secret_create, secret_list)'
                },
                secretId: {
                  type: 'string',
                  description: 'Secret ID (required for secret_create)'
                },
                value: {
                  type: 'string',
                  description: 'Secret value (required for secret_create)'
                },
                resourceType: {
                  type: 'string',
                  enum: ['subscription', 'environment', 'app'],
                  description: 'Resource type (required for access_control_show)'
                },
                email: {
                  type: 'string',
                  description: 'Email address (required for access_control_add, access_control_remove)'
                },
                role: {
                  type: 'string',
                  description: 'Role name (required for access_control_add, access_control_remove)'
                },
                roleName: {
                  type: 'string',
                  description: 'Role name (required for role_show)'
                },
                name: {
                  type: 'string',
                  description: 'Name (required for service_principal_create)'
                },
                expires: {
                  type: 'number',
                  description: 'Expiration in seconds (optional for service_principal_create)'
                },
                follow: {
                  type: 'boolean',
                  description: 'Follow logs (optional for job_logs_snapshot)'
                },
                limit: {
                  type: 'number',
                  description: 'Limit number of results (optional for get_audit_logs)'
                }
              },
              required: ['action'],
              additionalProperties: true
            }
          }
        ]
      }
    });
  }
  
  // Handle tools/call
  if (body.method === 'tools/call') {
    const toolName = body?.params?.name;
    const args = body?.params?.arguments;
    
    if (toolName !== 'cloud_cli') {
      return res.json({
        jsonrpc: '2.0',
        id: body.id,
        error: { code: -32602, message: 'Unknown tool' }
      });
    }
    
    try {
      const result = await invokeCloudCliTool(args);
      if (result.ok && 'data' in result) {
        return res.json({
          jsonrpc: '2.0',
          id: body.id,
          result: {
            content: [
              {
                type: 'text',
                text: JSON.stringify(result.data, null, 2)
              }
            ]
          }
        });
      } else {
        return res.json({
          jsonrpc: '2.0',
          id: body.id,
          error: {
            code: -32603,
            message: result.error?.message || 'Command failed',
            data: result.error
          }
        });
      }
    } catch (e: unknown) {
      const error = e instanceof Error ? e : new Error('Internal error');
      return res.json({
        jsonrpc: '2.0',
        id: body.id,
        error: { code: -32603, message: error.message }
      });
    }
  }
  
  // Legacy tool.invoke support
  if (body.method === 'tool.invoke') {
    const toolName = body?.params?.toolName;
    const args = body?.params?.args;
    if (toolName !== 'cloud_cli') {
      return res.status(404).json({ jsonrpc: '2.0', id: body.id, error: { code: 'tool_not_found', message: 'Tool not found' } });
    }
    try {
      const result = await invokeCloudCliTool(args);
      if (result.ok && 'data' in result) {
        res.json({ jsonrpc: '2.0', id: body.id, result: result.data });
      } else {
        res.json({ jsonrpc: '2.0', id: body.id, error: result.error });
      }
    } catch (e: unknown) {
      const error = e instanceof Error ? e : new Error('Internal error');
      res.status(500).json({ jsonrpc: '2.0', id: body.id, error: { code: 'internal_error', message: error.message } });
    }
    return;
  }
  
  // Unknown method
  return res.status(400).json({
    jsonrpc: '2.0',
    id: body?.id,
    error: { code: -32601, message: 'Method not found' }
  });
});

const port = process.env.PORT ? Number(process.env.PORT) : 7070;
const httpServer = createServer(app);
const wss = new WebSocketServer({ server: httpServer, path: '/ws/logs' });

wss.on('connection', (ws, req) => {
  const url = new URL(req.url || '', `http://${req.headers.host}`);
  const jobId = url.searchParams.get('jobId');
  
  if (!jobId) {
    ws.send(JSON.stringify({ error: true, text: 'Missing jobId parameter', done: true }));
    ws.close();
    return;
  }

  const cleanup = streamJobLogs({ jobId, ws });
  
  ws.on('close', () => {
    cleanup();
  });
});

httpServer.listen(port, () => {
  console.log(`[cloud-cli-mcp-server] HTTP on http://localhost:${port}`);
  console.log(`[cloud-cli-mcp-server] WebSocket on ws://localhost:${port}/ws/logs`);
});
