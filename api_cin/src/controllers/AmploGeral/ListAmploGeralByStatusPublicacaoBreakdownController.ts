import { Request, Response } from 'express';
import { ListAmploGeralByStatusPublicacaoBreakdown } from '../../services/AmploGeral/ListAmploGeralByStatusPublicacaoBreakdown';
import { BaseController } from '../BaseController';

export class ListAmploGeralByStatusPublicacaoBreakdownController extends BaseController {
  async handle(req: Request, res: Response): Promise<Response> {
    const service = new ListAmploGeralByStatusPublicacaoBreakdown();
    return super.handle(req, res, service.execute.bind(service));
  }
}