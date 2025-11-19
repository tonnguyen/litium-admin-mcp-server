import { z } from 'zod';
import { execCli } from '../cli/exec.js';
import { contextStore } from '../context/contextStore.js';
import { buildError } from '../errors/index.js';
import { auditLogger, generateCorrelationId, sanitizeArgs } from '../audit/auditLogger.js';

// Action schema
const baseActionSchema = z.object({ action: z.string() });

const setContextSchema = z.object({
  action: z.literal('set_context'),
  subscriptionId: z.string().optional(),
  environmentId: z.string().optional(),
});

const listSubscriptionsSchema = z.object({
  action: z.literal('list_subscriptions'),
});

const listEnvironmentsSchema = z.object({
  action: z.literal('list_environments'),
  subscriptionId: z.string().optional(),
});

const showContextSchema = z.object({
  action: z.literal('show_context'),
});

const deployAppSchema = z.object({
  action: z.literal('deploy_app'),
  appId: z.string(),
  artifactId: z.string(),
  subscriptionId: z.string().optional(),
  environmentId: z.string().optional(),
});

const jobStatusSchema = z.object({
  action: z.literal('job_status'),
  jobId: z.string(),
});

const jobLogsSnapshotSchema = z.object({
  action: z.literal('job_logs_snapshot'),
  jobId: z.string(),
  follow: z.boolean().optional(),
});

const consoleOutputSchema = z.object({
  action: z.literal('console_output'),
  appId: z.string(),
  subscriptionId: z.string().optional(),
  environmentId: z.string().optional(),
});

const artifactListSchema = z.object({
  action: z.literal('artifact_list'),
  subscriptionId: z.string().optional(),
});

const artifactShowSchema = z.object({
  action: z.literal('artifact_show'),
  artifactId: z.string(),
});

const artifactCreateSchema = z.object({
  action: z.literal('artifact_create'),
  filePath: z.string(),
  artifactType: z.enum(['dotnet', 'nextjs', 'sql', 'storage']),
  subscriptionId: z.string().optional(),
});

const marketplaceListSchema = z.object({
  action: z.literal('marketplace_list'),
  filter: z.string().optional(),
  details: z.boolean().optional(),
});

const manifestGenerateSchema = z.object({
  action: z.literal('manifest_generate'),
  appId: z.string(),
});

const secretCreateSchema = z.object({
  action: z.literal('secret_create'),
  secretId: z.string(),
  value: z.string(),
  scope: z.enum(['subscription', 'environment']),
  subscriptionId: z.string().optional(),
  environmentId: z.string().optional(),
});

const secretListSchema = z.object({
  action: z.literal('secret_list'),
  scope: z.enum(['subscription', 'environment']),
  subscriptionId: z.string().optional(),
  environmentId: z.string().optional(),
});

const accessControlShowSchema = z.object({
  action: z.literal('access_control_show'),
  resourceType: z.enum(['subscription', 'environment', 'app']),
  subscriptionId: z.string().optional(),
  environmentId: z.string().optional(),
  appId: z.string().optional(),
});

const accessControlAddSchema = z.object({
  action: z.literal('access_control_add'),
  resourceType: z.enum(['subscription', 'environment', 'app']),
  email: z.string(),
  role: z.string(),
  subscriptionId: z.string().optional(),
  environmentId: z.string().optional(),
  appId: z.string().optional(),
});

const accessControlRemoveSchema = z.object({
  action: z.literal('access_control_remove'),
  resourceType: z.enum(['subscription', 'environment', 'app']),
  email: z.string(),
  role: z.string(),
  subscriptionId: z.string().optional(),
  environmentId: z.string().optional(),
  appId: z.string().optional(),
});

const accessControlDisableInheritanceSchema = z.object({
  action: z.literal('access_control_disable_inheritance'),
  resourceType: z.enum(['environment']),
  environmentId: z.string(),
});

const roleListSchema = z.object({
  action: z.literal('role_list'),
});

const roleShowSchema = z.object({
  action: z.literal('role_show'),
  roleName: z.string(),
});

const servicePrincipalCreateSchema = z.object({
  action: z.literal('service_principal_create'),
  name: z.string(),
  filePath: z.string(),
  expires: z.number().optional(),
});

const subscriptionShowSchema = z.object({
  action: z.literal('subscription_show'),
  subscriptionId: z.string(),
});

const appListSchema = z.object({
  action: z.literal('app_list'),
  subscriptionId: z.string().optional(),
  environmentId: z.string().optional(),
});

const getAuditLogsSchema = z.object({
  action: z.literal('get_audit_logs'),
  limit: z.number().optional(),
});

const unionSchema = z.union([
  setContextSchema,
  listSubscriptionsSchema,
  listEnvironmentsSchema,
  showContextSchema,
  deployAppSchema,
  jobStatusSchema,
  jobLogsSnapshotSchema,
  consoleOutputSchema,
  artifactListSchema,
  artifactShowSchema,
  artifactCreateSchema,
  marketplaceListSchema,
  manifestGenerateSchema,
  secretCreateSchema,
  secretListSchema,
  accessControlShowSchema,
  accessControlAddSchema,
  accessControlRemoveSchema,
  accessControlDisableInheritanceSchema,
  roleListSchema,
  roleShowSchema,
  servicePrincipalCreateSchema,
  subscriptionShowSchema,
  appListSchema,
  getAuditLogsSchema,
]);

export async function invokeCloudCliTool(rawArgs: unknown) {
  const correlationId = generateCorrelationId();
  const startTime = Date.now();
  
  const parsed = unionSchema.safeParse(rawArgs);
  if (!parsed.success) {
    const result = { ok: false, error: buildError('validation_error', 'Invalid arguments', parsed.error.format()) };
    auditLogger.log({
      timestamp: new Date().toISOString(),
      correlationId,
      action: 'unknown',
      args: sanitizeArgs(rawArgs as Record<string, unknown>),
      durationMs: Date.now() - startTime,
      success: false,
      errorCode: 'validation_error',
    });
    return result;
  }
  const args = parsed.data;
  const action = args.action;

  try {
    const result = await executeAction(args);
    auditLogger.log({
      timestamp: new Date().toISOString(),
      correlationId,
      action,
      args: sanitizeArgs(args as Record<string, unknown>),
      durationMs: Date.now() - startTime,
      success: result.ok,
      errorCode: result.ok ? undefined : (result.error as any)?.code,
    });
    return result;
  } catch (error: any) {
    const result = { ok: false, error: buildError('internal_error', error?.message || 'Internal error') };
    auditLogger.log({
      timestamp: new Date().toISOString(),
      correlationId,
      action,
      args: sanitizeArgs(args as Record<string, unknown>),
      durationMs: Date.now() - startTime,
      success: false,
      errorCode: 'internal_error',
    });
    return result;
  }
}

async function executeAction(args: z.infer<typeof unionSchema>) {

  switch (args.action) {
    case 'set_context': {
      const updated = contextStore.setContext({
        subscriptionId: args.subscriptionId,
        environmentId: args.environmentId,
      });
      return { ok: true, data: { context: updated } };
    }
    case 'show_context': {
      return { ok: true, data: { context: contextStore.getContext() } };
    }
    case 'list_subscriptions': {
      const res = await execCli({ args: ['subscription', 'list', '-o', 'json'] });
      if (!res.ok) return { ok: false, error: buildError(res.errorCode || 'command_failed', res.errorMessage || 'Failed', { stderr: res.stderr }) };
      return { ok: true, data: { subscriptions: res.json ?? tryParseLines(res.stdout) } };
    }
    case 'list_environments': {
      const ctx = contextStore.getContext();
      const subscription = args.subscriptionId || ctx.subscriptionId;
      if (!subscription) return { ok: false, error: buildError('missing_subscription', 'Subscription id not provided or set in context') };
      const res = await execCli({ args: ['environment', 'list', '--subscription', subscription, '-o', 'json'] });
      if (!res.ok) return { ok: false, error: buildError(res.errorCode || 'command_failed', res.errorMessage || 'Failed', { stderr: res.stderr }) };
      return { ok: true, data: { environments: res.json ?? tryParseLines(res.stdout) } };
    }
    case 'deploy_app': {
      const ctx = contextStore.getContext();
      const subscription = args.subscriptionId || ctx.subscriptionId;
      const environment = args.environmentId || ctx.environmentId;
      if (!subscription) return { ok: false, error: buildError('missing_subscription', 'Subscription id required') };
      if (!environment) return { ok: false, error: buildError('missing_environment', 'Environment id required') };
      const cliArgs = ['app', 'deploy', '--app', args.appId, '--artifact', args.artifactId, '--subscription', subscription, '--environment', environment, '-o', 'json'];
      const res = await execCli({ args: cliArgs, timeoutMs: 120_000 });
      if (!res.ok) return { ok: false, error: buildError(res.errorCode || 'command_failed', res.errorMessage || 'Deploy failed', { stderr: res.stderr }) };
      return { ok: true, data: { deployment: res.json ?? { rawOutput: res.stdout } } };
    }
    case 'job_status': {
      const res = await execCli({ args: ['status', 'show', '--job', args.jobId, '-o', 'json'] });
      if (!res.ok) return { ok: false, error: buildError(res.errorCode || 'command_failed', res.errorMessage || 'Failed', { stderr: res.stderr }) };
      return { ok: true, data: { job: res.json ?? { rawOutput: res.stdout } } };
    }
    case 'job_logs_snapshot': {
      const cliArgs = ['status', 'logs', '--job', args.jobId];
      if (args.follow) cliArgs.push('--follow');
      const res = await execCli({ args: cliArgs, parseJson: false, timeoutMs: args.follow ? 300_000 : 60_000 });
      if (!res.ok) return { ok: false, error: buildError(res.errorCode || 'command_failed', res.errorMessage || 'Failed', { stderr: res.stderr }) };
      return { ok: true, data: { logs: tryParseLines(res.stdout) } };
    }
    case 'console_output': {
      const ctx = contextStore.getContext();
      const subscription = args.subscriptionId || ctx.subscriptionId;
      const environment = args.environmentId || ctx.environmentId;
      if (!subscription) return { ok: false, error: buildError('missing_subscription', 'Subscription id required') };
      if (!environment) return { ok: false, error: buildError('missing_environment', 'Environment id required') };
      // Set context first, then run console-output action
      await execCli({ args: ['context', 'set', '--subscription', subscription, '--environment', environment], parseJson: false });
      const res = await execCli({ args: ['app', 'action', '--action', 'console-output', '--app', args.appId, '-o', 'json'] });
      if (!res.ok) return { ok: false, error: buildError(res.errorCode || 'command_failed', res.errorMessage || 'Failed', { stderr: res.stderr }) };
      return { ok: true, data: { result: res.json ?? { rawOutput: res.stdout } } };
    }
    case 'artifact_list': {
      const ctx = contextStore.getContext();
      const subscription = args.subscriptionId || ctx.subscriptionId;
      if (!subscription) return { ok: false, error: buildError('missing_subscription', 'Subscription id required') };
      const res = await execCli({ args: ['artifact', 'list', '--subscription', subscription, '-o', 'json'], parseJson: false });
      if (!res.ok) return { ok: false, error: buildError(res.errorCode || 'command_failed', res.errorMessage || 'Failed', { stderr: res.stderr }) };
      return { ok: true, data: { artifacts: tryParseLines(res.stdout) } };
    }
    case 'artifact_show': {
      const res = await execCli({ args: ['artifact', 'show', '--artifact', args.artifactId, '-o', 'json'] });
      if (!res.ok) return { ok: false, error: buildError(res.errorCode || 'command_failed', res.errorMessage || 'Failed', { stderr: res.stderr }) };
      return { ok: true, data: { artifact: res.json ?? { rawOutput: res.stdout } } };
    }
    case 'artifact_create': {
      const ctx = contextStore.getContext();
      const subscription = args.subscriptionId || ctx.subscriptionId;
      if (!subscription) return { ok: false, error: buildError('missing_subscription', 'Subscription id required') };
      const cliArgs = ['artifact', 'create', '--subscription', subscription, '--artifact-type', args.artifactType, '--file-path', args.filePath, '--no-progress', '-o', 'json'];
      const res = await execCli({ args: cliArgs, timeoutMs: 600_000 });
      if (!res.ok) return { ok: false, error: buildError(res.errorCode || 'command_failed', res.errorMessage || 'Artifact creation failed', { stderr: res.stderr }) };
      return { ok: true, data: { artifact: res.json ?? { rawOutput: res.stdout } } };
    }
    case 'marketplace_list': {
      const cliArgs = ['marketplace', 'list'];
      if (args.filter) cliArgs.push('--filter', args.filter);
      if (args.details) cliArgs.push('--details');
      cliArgs.push('-o', 'json');
      const res = await execCli({ args: cliArgs, parseJson: false });
      if (!res.ok) return { ok: false, error: buildError(res.errorCode || 'command_failed', res.errorMessage || 'Failed', { stderr: res.stderr }) };
      return { ok: true, data: { apps: tryParseLines(res.stdout) } };
    }
    case 'manifest_generate': {
      const res = await execCli({ args: ['marketplace', 'manifest', '--app', args.appId], parseJson: false });
      if (!res.ok) return { ok: false, error: buildError(res.errorCode || 'command_failed', res.errorMessage || 'Failed', { stderr: res.stderr }) };
      return { ok: true, data: { manifest: res.stdout } };
    }
    case 'secret_create': {
      const ctx = contextStore.getContext();
      const subscription = args.subscriptionId || ctx.subscriptionId;
      if (!subscription) return { ok: false, error: buildError('missing_subscription', 'Subscription id required') };
      const cliArgs = args.scope === 'subscription'
        ? ['subscription', 'secret', 'create', '--secret', args.secretId, '--text-value', args.value, '--subscription', subscription]
        : ['environment', 'secret', 'create', '--secret', args.secretId, '--text-value', args.value, '--subscription', subscription, '--environment', args.environmentId || ctx.environmentId || ''];
      if (args.scope === 'environment' && !cliArgs[cliArgs.length - 1]) return { ok: false, error: buildError('missing_environment', 'Environment id required for environment scope') };
      const res = await execCli({ args: cliArgs, parseJson: false });
      if (!res.ok) return { ok: false, error: buildError(res.errorCode || 'command_failed', res.errorMessage || 'Failed', { stderr: res.stderr }) };
      return { ok: true, data: { message: 'Secret created', output: res.stdout } };
    }
    case 'secret_list': {
      const ctx = contextStore.getContext();
      const subscription = args.subscriptionId || ctx.subscriptionId;
      if (!subscription) return { ok: false, error: buildError('missing_subscription', 'Subscription id required') };
      const cliArgs = args.scope === 'subscription'
        ? ['subscription', 'secret', 'list', '--subscription', subscription]
        : ['environment', 'secret', 'list', '--subscription', subscription, '--environment', args.environmentId || ctx.environmentId || ''];
      if (args.scope === 'environment' && !cliArgs[cliArgs.length - 1]) return { ok: false, error: buildError('missing_environment', 'Environment id required for environment scope') };
      const res = await execCli({ args: cliArgs, parseJson: false });
      if (!res.ok) return { ok: false, error: buildError(res.errorCode || 'command_failed', res.errorMessage || 'Failed', { stderr: res.stderr }) };
      return { ok: true, data: { secrets: tryParseLines(res.stdout) } };
    }
    case 'access_control_show': {
      const ctx = contextStore.getContext();
      const subscription = args.subscriptionId || ctx.subscriptionId;
      if (!subscription) return { ok: false, error: buildError('missing_subscription', 'Subscription id required') };
      const cliArgs = [args.resourceType, 'access-control', 'show', '--subscription', subscription];
      if (args.resourceType === 'environment') {
        const env = args.environmentId || ctx.environmentId;
        if (!env) return { ok: false, error: buildError('missing_environment', 'Environment id required') };
        cliArgs.push('--environment', env);
      } else if (args.resourceType === 'app' && args.appId) {
        cliArgs.push('--app', args.appId);
      }
      const res = await execCli({ args: cliArgs, parseJson: false });
      if (!res.ok) return { ok: false, error: buildError(res.errorCode || 'command_failed', res.errorMessage || 'Failed', { stderr: res.stderr }) };
      return { ok: true, data: { accessControl: tryParseLines(res.stdout) } };
    }
    case 'access_control_add': {
      const ctx = contextStore.getContext();
      const subscription = args.subscriptionId || ctx.subscriptionId;
      if (!subscription) return { ok: false, error: buildError('missing_subscription', 'Subscription id required') };
      const cliArgs = [args.resourceType, 'access-control', 'add', '--email', args.email, '--role', args.role, '--subscription', subscription];
      if (args.resourceType === 'environment') {
        const env = args.environmentId || ctx.environmentId;
        if (!env) return { ok: false, error: buildError('missing_environment', 'Environment id required') };
        cliArgs.push('--environment', env);
      } else if (args.resourceType === 'app' && args.appId) {
        cliArgs.push('--app', args.appId);
      }
      const res = await execCli({ args: cliArgs, parseJson: false });
      if (!res.ok) return { ok: false, error: buildError(res.errorCode || 'command_failed', res.errorMessage || 'Failed', { stderr: res.stderr }) };
      return { ok: true, data: { message: 'Access granted', output: res.stdout } };
    }
    case 'access_control_remove': {
      const ctx = contextStore.getContext();
      const subscription = args.subscriptionId || ctx.subscriptionId;
      if (!subscription) return { ok: false, error: buildError('missing_subscription', 'Subscription id required') };
      const cliArgs = [args.resourceType, 'access-control', 'remove', '--email', args.email, '--role', args.role, '--subscription', subscription];
      if (args.resourceType === 'environment') {
        const env = args.environmentId || ctx.environmentId;
        if (!env) return { ok: false, error: buildError('missing_environment', 'Environment id required') };
        cliArgs.push('--environment', env);
      } else if (args.resourceType === 'app' && args.appId) {
        cliArgs.push('--app', args.appId);
      }
      const res = await execCli({ args: cliArgs, parseJson: false });
      if (!res.ok) return { ok: false, error: buildError(res.errorCode || 'command_failed', res.errorMessage || 'Failed', { stderr: res.stderr }) };
      return { ok: true, data: { message: 'Access removed', output: res.stdout } };
    }
    case 'access_control_disable_inheritance': {
      const res = await execCli({ args: ['environment', 'access-control', 'disable-inheritance', '--environment', args.environmentId], parseJson: false });
      if (!res.ok) return { ok: false, error: buildError(res.errorCode || 'command_failed', res.errorMessage || 'Failed', { stderr: res.stderr }) };
      return { ok: true, data: { message: 'Inheritance disabled', output: res.stdout } };
    }
    case 'role_list': {
      const res = await execCli({ args: ['role', 'list', '-o', 'json'], parseJson: false });
      if (!res.ok) return { ok: false, error: buildError(res.errorCode || 'command_failed', res.errorMessage || 'Failed', { stderr: res.stderr }) };
      return { ok: true, data: { roles: tryParseLines(res.stdout) } };
    }
    case 'role_show': {
      const res = await execCli({ args: ['role', 'show', '--role', args.roleName, '-o', 'json'], parseJson: false });
      if (!res.ok) return { ok: false, error: buildError(res.errorCode || 'command_failed', res.errorMessage || 'Failed', { stderr: res.stderr }) };
      return { ok: true, data: { role: tryParseLines(res.stdout) } };
    }
    case 'service_principal_create': {
      const cliArgs = ['service-principal', 'create', '--name', args.name, '--file', args.filePath];
      if (args.expires) cliArgs.push('--expires', String(args.expires));
      const res = await execCli({ args: cliArgs, parseJson: false });
      if (!res.ok) return { ok: false, error: buildError(res.errorCode || 'command_failed', res.errorMessage || 'Failed', { stderr: res.stderr }) };
      return { ok: true, data: { message: 'Service principal created', output: res.stdout } };
    }
    case 'subscription_show': {
      const res = await execCli({ args: ['subscription', 'show', '--subscription', args.subscriptionId, '-o', 'json'] });
      if (!res.ok) return { ok: false, error: buildError(res.errorCode || 'command_failed', res.errorMessage || 'Failed', { stderr: res.stderr }) };
      return { ok: true, data: { subscription: res.json ?? { rawOutput: res.stdout } } };
    }
    case 'app_list': {
      const ctx = contextStore.getContext();
      const subscription = args.subscriptionId || ctx.subscriptionId;
      const environment = args.environmentId || ctx.environmentId;
      if (!subscription) return { ok: false, error: buildError('missing_subscription', 'Subscription id required') };
      if (!environment) return { ok: false, error: buildError('missing_environment', 'Environment id required') };
      const res = await execCli({ args: ['app', 'list', '--subscription', subscription, '--environment', environment, '-o', 'json'], parseJson: false });
      if (!res.ok) return { ok: false, error: buildError(res.errorCode || 'command_failed', res.errorMessage || 'Failed', { stderr: res.stderr }) };
      return { ok: true, data: { apps: tryParseLines(res.stdout) } };
    }
    case 'get_audit_logs': {
      const logs = auditLogger.getRecent(args.limit || 50);
      return { ok: true, data: { logs } };
    }
    default:
      return { ok: false, error: buildError('unsupported_action', 'Action not implemented') };
  }
}

function tryParseLines(stdout: string): string[] {
  return stdout.split('\n').map(l => l.trim()).filter(Boolean);
}
