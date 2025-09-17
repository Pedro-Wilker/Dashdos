import { Request, Response } from 'express';
import { z } from 'zod';
import { ListTopAndLeastProductiveCitiesService } from '../../services/ProdutividadeDiaria/ListTopAndLeastProdutividadeDiariaService';
import { BaseController } from '../BaseController';
import logger from '../../lib/logger';
import { ProductivityFilter } from '../../types/serviceArgs';

export class ListTopAndLeastProductiveCitiesController extends BaseController {
  async handle(req: Request, res: Response): Promise<Response> {
    const schema = z.object({
      ano: z.coerce.number().int().min(2000).max(2030),
      limit: z.coerce.number().int().positive().optional().default(5)
    });

    try {
      const { ano, limit } = schema.parse(req.query) as ProductivityFilter;
      const service = new ListTopAndLeastProductiveCitiesService();
      return super.handle(req, res, service.execute.bind(service), { ano, limit });
    } catch (e: any) {
      logger.error('Validation error', { error: e.message, stack: e.stack });
      return res.status(400).json({
        error: { code: 'VALIDATION_ERROR', message: e.message }
      });
    }
  }
}