import { Request, Response } from 'express';
import { ListAmploGeralByVisitedCities } from '../../services/AmploGeral/ListAmploGeralByVisitedCities'; 

export class ListAmploGeralByVisitedCitiesController {
  async handle(req: Request, res: Response) {
    const service = new ListAmploGeralByVisitedCities();

    try {
      const result = await service.execute();
      return res.status(200).json(result);
    } catch (error: any) {
      return res.status(500).json({ error: 'Erro ao listar cidades visitadas', details: error.message });
    }
  }
}