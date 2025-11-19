import { spawn } from 'node:child_process';
import { contextStore } from '../context/contextStore.js';

export interface ExecResult {
  ok: boolean;
  code: number | null;
  stdout: string;
  stderr: string;
  json?: unknown;
  errorCode?: string;
  errorMessage?: string;
}

export interface ExecOptions {
  args: string[];
  timeoutMs?: number;
  parseJson?: boolean;
}

const DEFAULT_TIMEOUT = 60_000;

export function execCli(opts: ExecOptions): Promise<ExecResult> {
  const { args, timeoutMs = DEFAULT_TIMEOUT, parseJson = true } = opts;
  return new Promise((resolve) => {
    // Get LC_CLI_URL from context store or environment
    const env = { ...process.env };
    const cliUrl = contextStore.getCliUrl();
    if (cliUrl) {
      env.LC_CLI_URL = cliUrl;
    }
    
    const proc = spawn('litium-cloud', args, { 
      stdio: ['ignore', 'pipe', 'pipe'],
      env
    });
    let stdout = '';
    let stderr = '';
    let finished = false;
    const timer = setTimeout(() => {
      if (!finished) {
        finished = true;
        proc.kill('SIGKILL');
        resolve({ ok: false, code: null, stdout, stderr, errorCode: 'timeout', errorMessage: 'CLI command timed out' });
      }
    }, timeoutMs);

    proc.stdout.on('data', (d) => { stdout += d.toString(); });
    proc.stderr.on('data', (d) => { stderr += d.toString(); });

    proc.on('error', (err) => {
      if (finished) return;
      finished = true;
      clearTimeout(timer);
      resolve({ ok: false, code: null, stdout, stderr, errorCode: 'spawn_error', errorMessage: err.message });
    });

    proc.on('close', (code) => {
      if (finished) return;
      finished = true;
      clearTimeout(timer);
      if (code === 0) {
        let json: unknown | undefined;
        if (parseJson) {
          json = tryParseJson(stdout);
        }
        resolve({ ok: true, code, stdout, stderr, json });
      } else {
        const mapped = mapError(stderr);
        resolve({ ok: false, code, stdout, stderr, errorCode: mapped.code, errorMessage: mapped.message });
      }
    });
  });
}

function tryParseJson(text: string): unknown | undefined {
  const trimmed = text.trim();
  if (!trimmed) return undefined;
  try {
    return JSON.parse(trimmed);
  } catch {
    return undefined;
  }
}

function mapError(stderr: string): { code: string; message: string } {
  const s = stderr.toLowerCase();
  if (s.includes('not logged in') || s.includes('login required')) return { code: 'auth_required', message: 'Authentication required. Run `litium-cloud auth login`.' };
  if (s.includes('permission')) return { code: 'permission_denied', message: 'Permission denied.' };
  if (s.includes('not found')) return { code: 'not_found', message: 'Resource not found.' };
  if (s.includes('certificate')) return { code: 'auth_required', message: 'Certificate error. Re-login with service principal.' };
  return { code: 'command_failed', message: stderr.trim() || 'Command failed.' };
}
