import { Request, Response } from 'express';
import { CreateProdutividadeDiaria } from '../../services/ProdutividadeDiaria/CreateProdutividadeDiariaService'; 

export class CreateProdutividadeDiariaController {
  async handle(req: Request, res: Response) {
    const registros = req.body;
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      return res.status(400).json({ error: 'Token inválido' });
    }

    if (!Array.isArray(registros) || registros.length === 0) {
      return res.status(400).json({ error: 'Nenhum registro enviado.' });
    }

    const service = new CreateProdutividadeDiaria();
    const resultados = [];

    for (const registro of registros) {
      const { cin_amplo_geral_id, data, quantidade } = registro;

      if (!cin_amplo_geral_id || !data || quantidade === undefined) {
        return res.status(400).json({
          error: `Campos obrigatórios ausentes no registro com município ID ${cin_amplo_geral_id}.`,
        });
      }

      try {
        const result = await service.execute(
          {
            cin_amplo_geral_id,
            data: new Date(data),
            quantidade,
          },
          token
        );
        resultados.push(result);
      } catch (error: any) {
        return res.status(400).json({
          error: `Erro ao criar produtividade para município ID ${cin_amplo_geral_id} na data ${data}: ${error.message}`,
        });
      }
    }

    return res.status(201).json({
      message: 'Registros criados com sucesso.',
      resultados,
    });
  }
}