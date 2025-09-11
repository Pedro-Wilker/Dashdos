import { Request, Response } from 'express';
import { GetMonthlyProductivityService } from '../../services/ProdutividadeDiaria/GetMonthlyProdutividadeDiariaService';

export class GetMonthlyProductivityController {
  async handle(req: Request, res: Response) {
    const { cin_amplo_geral_id, ano } = req.query;

    if (!cin_amplo_geral_id || isNaN(Number(cin_amplo_geral_id)) || Number(cin_amplo_geral_id) <= 0) {
      return res.status(400).json({ error: 'cin_amplo_geral_id é obrigatório e deve ser um número inteiro positivo.' });
    }

    if (!ano || isNaN(Number(ano))) {
      return res.status(400).json({ error: 'Ano é obrigatório e deve ser um número.' });
    }

    const service = new GetMonthlyProductivityService();

    try {
      const result = await service.execute({
        cin_amplo_geral_id: Number(cin_amplo_geral_id),
        ano: Number(ano),
      });
      return res.status(200).json(result);
    } catch (error: any) {
      return res.status(400).json({ error: error.message });
    }
  }
}