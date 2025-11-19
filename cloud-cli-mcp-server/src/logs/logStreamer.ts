import { spawn } from 'node:child_process';
import type { WebSocket } from 'ws';

export interface StreamOptions {
  jobId: string;
  ws: WebSocket;
}

export function streamJobLogs(opts: StreamOptions): () => void {
  const { jobId, ws } = opts;
  const proc = spawn('litium-cloud', ['status', 'logs', '--job', jobId, '--follow']);
  
  let lineNumber = 0;
  let buffer = '';

  proc.stdout.on('data', (chunk) => {
    buffer += chunk.toString();
    const lines = buffer.split('\n');
    buffer = lines.pop() || '';
    
    for (const line of lines) {
      if (line.trim()) {
        lineNumber++;
        ws.send(JSON.stringify({ jobId, lineNumber, text: line, done: false }));
      }
    }
  });

  proc.stderr.on('data', (chunk) => {
    const text = chunk.toString();
    ws.send(JSON.stringify({ jobId, error: true, text, done: false }));
  });

  proc.on('close', (code) => {
    if (buffer.trim()) {
      lineNumber++;
      ws.send(JSON.stringify({ jobId, lineNumber, text: buffer, done: false }));
    }
    ws.send(JSON.stringify({ jobId, code, done: true }));
    ws.close();
  });

  proc.on('error', (err) => {
    ws.send(JSON.stringify({ jobId, error: true, text: err.message, done: true }));
    ws.close();
  });

  return () => {
    proc.kill('SIGTERM');
  };
}
