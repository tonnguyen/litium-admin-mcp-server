export interface CloudErrorShape {
  code: string;
  message: string;
  detail?: unknown;
}

export function buildError(code: string, message: string, detail?: unknown): CloudErrorShape {
  return { code, message, detail };
}
