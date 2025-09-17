import { Request, Response } from 'express';
import { ListAmploGeralByVisitedCities } from '../../services/AmploGeral/ListAmploGeralByVisitedCities';
import { BaseController } from '../BaseController';

export class ListAmploGeralByVisitedCitiesController extends BaseController {
  async handle(req: Request, res: Response): Promise<Response> {
    const service = new ListAmploGeralByVisitedCities();
    return super.handle(req, res, service.execute.bind(service));
  }
}