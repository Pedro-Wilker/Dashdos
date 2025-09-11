import { Request, Response } from 'express';
import { ListTopProductiveCitiesService } from '../../services/ProdutividadeDiaria/ListTopProdutividadeDiariaService';

export class ListTopProductiveCitiesController {
  async handle(req: Request, res: Response) {
    const { ano, limit } = req.query;

    if (!ano || isNaN(Number(ano))) {
      return res.status(400).json({ error: 'Ano é obrigatório e deve ser um número.' });
    }

    if (limit && (isNaN(Number(limit)) || Number(limit) <= 0)) {
      return res.status(400).json({ error: 'Limit deve ser um número inteiro positivo.' });
    }

    const service = new ListTopProductiveCitiesService();

    try {
      const result = await service.execute({
        ano: Number(ano),
        limit: limit ? Number(limit) : 5,
      });
      return res.status(200).json(result);
    } catch (error: any) {
      return res.status(400).json({ error: error.message });
    }
  }
}