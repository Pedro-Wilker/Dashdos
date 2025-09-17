import { Request, Response } from 'express';
import { z } from 'zod';
import { ListAmploGeralByMunicipioAutocompleteService } from '../../services/AmploGeral/ListAmploGeralByMunicipioAutocompleteService';
import { BaseController } from '../BaseController';
import logger from '../../lib/logger';
import { AutocompleteFilter } from '../../types/serviceArgs';

export class ListAmploGeralByMunicipioAutocompleteController extends BaseController {
  async handle(req: Request, res: Response): Promise<Response> {
    const schema = z.object({
      query: z.string().min(1, 'Query é obrigatória'),
      limit: z.coerce.number().int().positive().optional().default(10)
    });

    try {
      const { query, limit } = schema.parse(req.query) as AutocompleteFilter;
      const service = new ListAmploGeralByMunicipioAutocompleteService();
      return super.handle(req, res, service.execute.bind(service), query, limit);
    } catch (e: any) {
      logger.error('Validation error', { error: e.message, stack: e.stack });
      return res.status(400).json({
        error: { code: 'VALIDATION_ERROR', message: e.message }
      });
    }
  }
}