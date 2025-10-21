import { logger } from './logger.js';
import { AuthenticationError, TokenExpiredError } from '../types/auth.js';
import { ConfigError } from '../types/config.js';

export class ApiError extends Error {
  constructor(
    message: string,
    public statusCode?: number,
    public originalError?: Error
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

export function handleError(error: unknown): ApiError {
  logger.error('Error occurred:', error);

  if (error instanceof ApiError) {
    return error;
  }

  if (error instanceof AuthenticationError) {
    return new ApiError(
      `Authentication failed: ${error.message}`,
      error.statusCode || 401,
      error
    );
  }

  if (error instanceof TokenExpiredError) {
    return new ApiError(
      'Authentication token has expired. Please check your credentials.',
      401,
      error
    );
  }

  if (error instanceof ConfigError) {
    return new ApiError(
      `Configuration error: ${error.message}`,
      500,
      error
    );
  }

  if (error instanceof Error) {
    return new ApiError(
      `Unexpected error: ${error.message}`,
      500,
      error
    );
  }

  return new ApiError(
    'An unknown error occurred',
    500
  );
}

export function formatErrorForMCP(error: ApiError): string {
  const baseMessage = error.message;
  
  if (error.statusCode) {
    return `${baseMessage} (Status: ${error.statusCode})`;
  }
  
  return baseMessage;
}