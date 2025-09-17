import { Request, Response } from 'express';
import { z } from 'zod';
import { ListProdutividadeGeralMensal } from '../../services/ProdutividadeDiaria/ListProdutividadeGeralMensal';
import { BaseController } from '../BaseController';
import logger from '../../lib/logger';
import { LimitFilter } from '../../types/serviceArgs';

export class ListProdutividadeGeralMensalController extends BaseController {
  async handle(req: Request, res: Response): Promise<Response> {
    const schema = z.object({
      limit: z.coerce.number().int().positive().optional()
    });

    try {
      const { limit } = schema.parse(req.query) as LimitFilter;
      const service = new ListProdutividadeGeralMensal();
      return super.handle(req, res, service.execute.bind(service), limit);
    } catch (e: any) {
      logger.error('Validation error', { error: e.message, stack: e.stack });
      return res.status(400).json({
        error: { code: 'VALIDATION_ERROR', message: e.message }
      });
    }
  }
}