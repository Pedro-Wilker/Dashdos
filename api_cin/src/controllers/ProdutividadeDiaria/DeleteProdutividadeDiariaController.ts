import { Request, Response } from 'express';
import { DeleteProdutividadeDiariaService } from '../../services/ProdutividadeDiaria/DeleteProdutividadeDiariaService';

export class DeleteProdutividadeDiariaController {
  async handle(req: Request, res: Response) {
    const { id } = req.params;
    const token = req.headers.authorization?.split(' ')[1];

    if (!id || isNaN(Number(id)) || Number(id) <= 0) {
      return res.status(400).json({ error: 'ID é obrigatório e deve ser um número inteiro positivo.' });
    }

    if (!token) {
      return res.status(400).json({ error: 'Token inválido' });
    }

    const service = new DeleteProdutividadeDiariaService();

    try {
      const result = await service.execute(Number(id), token);
      return res.status(200).json(result);
    } catch (error: any) {
      return res.status(400).json({ error: error.message });
    }
  }
}