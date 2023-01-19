/* eslint-disable @typescript-eslint/no-explicit-any */
import { ValidationError, PrismaClientKnownRequestError } from '@mpa/db';
import { logger } from '@mpa/log';
import { json } from '@sveltejs/kit';

const log = logger('api');

export interface APIError {
  status: number;
  code: string;
  message?: string;
  errors?: any[];
}

function getClientErrorResponse(err: Error): APIError {
  if (err instanceof ValidationError) {
    return { status: 400, code: 'ValidationError', errors: err.errors, message: 'Request validation failed' };
  } else if (err instanceof PrismaClientKnownRequestError) {
    if (err.code === 'P2002' && Array.isArray(err.meta.target) && err.meta.target.includes('slug')) {
      return {
        status: 403,
        code: 'SlugExists',
        message: `A page with that slug already exists`
      };
    }
  }

  return { status: 500, code: err.name, message: err.message };
}

/**
 * A shared wrapper for API endpoints for unified error handling. Is there a better way to do this with Svelte?!?
 * @param fn a RequestHandler function
 * @returns Wrapped RequestHandler function
 */
export function apiEndpoint<T extends (...args: any[]) => any>(fn: T): T {
  return async function (...args: Parameters<T>) {
    try {
      const response = await fn(...args);
      return response;
    } catch (err) {
      if (err instanceof Error) {
        const clientError = getClientErrorResponse(err);
        log.error({ error: err, clientError }, 'Error in API endpoint');
        return json(clientError, { status: clientError.status });
      }
      return json({ code: 'UnknownError', message: err.message }, { status: 500 });
    }
  } as T;
}
