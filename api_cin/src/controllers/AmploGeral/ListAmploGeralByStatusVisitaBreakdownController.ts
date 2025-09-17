import { Request, Response } from 'express';
import { ListAmploGeralByStatusVisitaBreakdown } from '../../services/AmploGeral/ListAmploGeralByStatusVisitaBreakdown';
import { BaseController } from '../BaseController';

export class ListAmploGeralByStatusVisitaBreakdownController extends BaseController {
  async handle(req: Request, res: Response): Promise<Response> {
    const service = new ListAmploGeralByStatusVisitaBreakdown();
    return super.handle(req, res, service.execute.bind(service));
  }
}