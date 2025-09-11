import { Request, Response } from 'express';
import { ListProdutividadeByCidade } from '../../services/ProdutividadeDiaria/ListProdutividadeByCidade';

export class ListProdutividadeByCidadeController {
  async handle(req: Request, res: Response) {
    const { nome_municipio } = req.params;
    const service = new ListProdutividadeByCidade();

    try {
      const result = await service.execute(nome_municipio);
      if (!result) {
        return res.status(404).json({ error: 'Cidade não encontrada' });
      }
      return res.status(200).json(result);
    } catch (error: any) {
      return res.status(500).json({ error: 'Erro ao listar produtividade por cidade', details: error.message });
    }
  }
}