import { Request, Response } from 'express';
import { ListAllAmploGeralService } from '../../services/AmploGeral/ListAllAmploGeralService';
import { BaseController } from '../BaseController';

export class ListAllAmploGeralController extends BaseController {
  async handle(req: Request, res: Response): Promise<Response> {
    const service = new ListAllAmploGeralService();
    return super.handle(req, res, service.execute.bind(service));
  }
}