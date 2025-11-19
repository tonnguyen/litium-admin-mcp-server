type FieldMap = Record<string, any>;

function isMergeableObject(value: any): value is FieldMap {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
}

export function mergeFieldValues(existing?: FieldMap, updates?: FieldMap): FieldMap | undefined {
  if (!updates) {
    return existing;
  }

  const base: FieldMap = existing ? { ...existing } : {};

  for (const [key, value] of Object.entries(updates)) {
    if (isMergeableObject(value)) {
      base[key] = mergeFieldValues(base[key], value);
    } else {
      base[key] = value;
    }
  }

  return base;
}

export function sanitizeFields(fields?: FieldMap, readOnlyKeys: string[] = []): FieldMap | undefined {
  if (!fields) return fields;
  const sanitized: FieldMap = {};
  for (const [key, value] of Object.entries(fields)) {
    if (readOnlyKeys.includes(key)) {
      continue;
    }
    sanitized[key] = value;
  }
  return sanitized;
}

