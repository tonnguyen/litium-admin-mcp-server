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
  stdinInput?: string;
}

const DEFAULT_TIMEOUT = 60_000;
const MAX_BUFFER_SIZE = 10 * 1024 * 1024; // 10MB limit

function appendWithLimit(current: string, newData: Buffer, maxSize: number): { result: string; truncated: boolean } {
  const currentSize = Buffer.byteLength(current, 'utf8');
  const newSize = newData.length;
  
  if (currentSize + newSize > maxSize) {
    const remaining = maxSize - currentSize;
    if (remaining > 100) {
      // Try to append what we can, leaving room for truncation message
      const truncatedData = newData.subarray(0, remaining - 50);
      const truncated = current + truncatedData.toString('utf8') + '\n...[output truncated due to size limit]';
      return { result: truncated, truncated: true };
    }
    return { result: current + '\n...[output truncated due to size limit]', truncated: true };
  }
  return { result: current + newData.toString('utf8'), truncated: false };
}

export function execCli(opts: ExecOptions): Promise<ExecResult> {
  const { args, timeoutMs = DEFAULT_TIMEOUT, parseJson = true, stdinInput } = opts;
  return new Promise((resolve) => {
    // Get LC_CLI_URL from context store or environment
    const env = { ...process.env };
    const cliUrl = contextStore.getCliUrl();
    if (cliUrl) {
      env.LC_CLI_URL = cliUrl;
    }
    
    // Use 'pipe' for stdin if we need to provide input, otherwise 'ignore'
    const proc = spawn('litium-cloud', args, { 
      stdio: stdinInput ? ['pipe', 'pipe', 'pipe'] : ['ignore', 'pipe', 'pipe'],
      env
    });
    
    // If stdin input is provided, write it and close stdin
    if (stdinInput && proc.stdin) {
      proc.stdin.write(stdinInput);
      proc.stdin.end();
    }
    let stdout = '';
    let stderr = '';
    let stdoutTruncated = false;
    let stderrTruncated = false;
    let finished = false;
    const timer = setTimeout(() => {
      if (!finished) {
        finished = true;
        proc.kill('SIGKILL');
        resolve({ ok: false, code: null, stdout, stderr, errorCode: 'timeout', errorMessage: 'CLI command timed out' });
      }
    }, timeoutMs);

    if (proc.stdout) {
      proc.stdout.on('data', (d: Buffer) => {
        if (!stdoutTruncated) {
          const result = appendWithLimit(stdout, d, MAX_BUFFER_SIZE);
          stdout = result.result;
          stdoutTruncated = result.truncated;
        }
      });
    }
    
    if (proc.stderr) {
      proc.stderr.on('data', (d: Buffer) => {
        if (!stderrTruncated) {
          const result = appendWithLimit(stderr, d, MAX_BUFFER_SIZE);
          stderr = result.result;
          stderrTruncated = result.truncated;
        }
      });
    }

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
        // Check both stdout and stderr for errors (some APIs return errors in stdout as JSON)
        const errorText = stderr || stdout;
        const mapped = mapError(errorText);
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
  if (s.includes('forbidden') || s.includes('403')) return { code: 'permission_denied', message: 'Forbidden (403). ' + (stderr.trim() || 'Permission denied or resource not available.') };
  return { code: 'command_failed', message: stderr.trim() || 'Command failed.' };
}
