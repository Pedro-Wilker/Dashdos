import { Request, Response } from 'express';
import { ListAmploGeralByVisitas } from '../../services/AmploGeral/ListAmploGeralByVisitasService';

export class ListAmploGeralByVisitasController {
  async handle(req: Request, res: Response) {
    const service = new ListAmploGeralByVisitas();

    try {
      const result = await service.execute();
      return res.status(200).json(result);
    } catch (error: any) {
      return res.status(500).json({ error: 'Erro ao listar cidades para visita', details: error.message });
    }
  }
}