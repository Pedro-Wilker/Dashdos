import { Request, Response } from 'express';
import { UpdateProdutividadeDiariaService } from '../../services/ProdutividadeDiaria/UpdateProdutividadeDiariaService';

export class UpdateProdutividadeDiariaController {
  async handle(req: Request, res: Response) {
    const { id } = req.params;
    const { cin_amplo_geral_id, data, quantidade } = req.body;
    const token = req.headers.authorization?.split(' ')[1];

    if (!id || isNaN(Number(id)) || Number(id) <= 0) {
      return res.status(400).json({ error: 'ID é obrigatório e deve ser um número inteiro positivo.' });
    }

    if (!cin_amplo_geral_id && !data && quantidade === undefined) {
      return res.status(400).json({ error: 'Pelo menos um campo (cin_amplo_geral_id, data, quantidade) deve ser fornecido.' });
    }

    if (!token) {
      return res.status(400).json({ error: 'Token inválido' });
    }

    if (cin_amplo_geral_id && (!Number.isInteger(Number(cin_amplo_geral_id)) || Number(cin_amplo_geral_id) <= 0)) {
      return res.status(400).json({ error: 'cin_amplo_geral_id deve ser um número inteiro positivo.' });
    }

    if (data && isNaN(Date.parse(data))) {
      return res.status(400).json({ error: 'Formato de data inválido. Use YYYY-MM-DD.' });
    }

    if (quantidade !== undefined && (!Number.isInteger(Number(quantidade)) || Number(quantidade) < 0)) {
      return res.status(400).json({ error: 'Quantidade deve ser um número inteiro não negativo.' });
    }

    const service = new UpdateProdutividadeDiariaService();

    try {
      const result = await service.execute(
        {
          id: Number(id),
          cin_amplo_geral_id: cin_amplo_geral_id ? Number(cin_amplo_geral_id) : undefined,
          data: data ? new Date(data) : undefined,
          quantidade: quantidade !== undefined ? Number(quantidade) : undefined,
        },
        token
      );
      return res.status(200).json(result);
    } catch (error: any) {
      return res.status(400).json({ error: error.message });
    }
  }
}