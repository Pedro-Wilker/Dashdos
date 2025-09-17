import { Request, Response } from 'express';
import { z } from 'zod';
import { ListProdutividadeByCidade } from '../../services/ProdutividadeDiaria/ListProdutividadeByCidade';
import { BaseController } from '../BaseController';
import logger from '../../lib/logger';
import { MunicipioFilter } from '../../types/serviceArgs';

export class ListProdutividadeByCidadeController extends BaseController {
  async handle(req: Request, res: Response): Promise<Response> {
    const schema = z.object({
      nome_municipio: z.string().min(1, 'Nome do município é obrigatório')
    });

    try {
      const { nome_municipio } = schema.parse(req.params) as MunicipioFilter;
      const service = new ListProdutividadeByCidade();
      const result = await service.execute(nome_municipio);
      if (!result) {
        return res.status(404).json({
          error: { code: 'NOT_FOUND', message: 'Cidade não encontrada' }
        });
      }
      return super.handle(req, res, () => Promise.resolve(result));
    } catch (e: any) {
      logger.error('Validation error', { error: e.message, stack: e.stack });
      return res.status(400).json({
        error: { code: 'VALIDATION_ERROR', message: e.message }
      });
    }
  }
}