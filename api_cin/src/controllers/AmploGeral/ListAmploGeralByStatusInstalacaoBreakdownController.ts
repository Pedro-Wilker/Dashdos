import { Request, Response } from 'express';
import { ListAmploGeralByStatusInstalacaoBreakdown } from '../../services/AmploGeral/ListAmploGeralByStatusInstalacaoBreakdown';
import { BaseController } from '../BaseController';

export class ListAmploGeralByStatusInstalacaoBreakdownController extends BaseController {
  async handle(req: Request, res: Response): Promise<Response> {
    const service = new ListAmploGeralByStatusInstalacaoBreakdown();
    return super.handle(req, res, service.execute.bind(service));
  }
}