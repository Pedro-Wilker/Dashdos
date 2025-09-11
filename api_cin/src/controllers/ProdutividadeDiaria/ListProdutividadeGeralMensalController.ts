import { Request, Response } from 'express';
import { ListProdutividadeGeralMensal } from '../../services/ProdutividadeDiaria/ListProdutividadeGeralMensal';

export class ListProdutividadeGeralMensalController {
  async handle(req: Request, res: Response) {
    const service = new ListProdutividadeGeralMensal();
    const { limit } = req.query;

    try {
      const parsedLimit = limit ? parseInt(limit as string, 10) : undefined;
      if (parsedLimit !== undefined && (isNaN(parsedLimit) || parsedLimit <= 0)) {
        return res.status(400).json({ error: 'O parâmetro limit deve ser um número positivo' });
      }

      const result = await service.execute(parsedLimit);
      return res.status(200).json(result);
    } catch (error: any) {
      return res.status(500).json({ error: 'Erro ao listar produtividade geral mensal', details: error.message });
    }
  }
}