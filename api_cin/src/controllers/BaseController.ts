import { Request, Response } from 'express';
import logger from '../lib/logger';

export class BaseController {
  protected async handle<T>(req: Request, res: Response, serviceFn: (...args: any[]) => Promise<T>, ...args: any[]): Promise<Response> {
    try {
      const result = await serviceFn(...args);
      return res.status(200).json({
        data: result,
        meta: result && Array.isArray(result) ? { count: result.length } : {}
      });
    } catch (e: any) {
      logger.error('Controller error', { error: e.message, stack: e.stack });
      return res.status(500).json({
        error: { code: 'INTERNAL_SERVER_ERROR', message: e.message }
      });
    }
  }
}