import { Request, Response } from 'express';
import { z } from 'zod';
import { ListByNomeMunicipioAmploGeralService } from '../../services/AmploGeral/ListAmploGeralByMunicipioService';
import { BaseController } from '../BaseController';
import logger from '../../lib/logger';
import { MunicipioFilter } from '../../types/serviceArgs';

export class ListByNomeMunicipioAmploGeralController extends BaseController {
  async handle(req: Request, res: Response): Promise<Response> {
    const schema = z.object({
      nome_municipio: z.string().min(1, 'Nome do município é obrigatório')
    });

    try {
      const { nome_municipio } = schema.parse(req.query) as MunicipioFilter;
      const service = new ListByNomeMunicipioAmploGeralService();
      return super.handle(req, res, service.execute.bind(service), nome_municipio);
    } catch (e: any) {
      logger.error('Validation error', { error: e.message, stack: e.stack });
      return res.status(400).json({
        error: { code: 'VALIDATION_ERROR', message: e.message }
      });
    }
  }
}