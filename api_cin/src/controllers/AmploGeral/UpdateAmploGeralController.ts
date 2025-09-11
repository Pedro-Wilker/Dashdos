import { Request, Response } from 'express';
import { UpdateAmploGeralService } from '../../services/AmploGeral/UpdateAmploGeralService';
import { StatusVisita, StatusPublicacao, StatusInstalacao } from '@prisma/client';

export class UpdateAmploGeralController {
  async handle(req: Request, res: Response) {
    const { id } = req.params;
    const { nome_municipio, status_infra, periodo_visita, status_visita, status_publicacao, status_instalacao, publicacao, periodo_instalacao } = req.body;
    const token = req.headers.authorization?.split(' ')[1];

    if (!id || isNaN(Number(id)) || Number(id) <= 0) {
      return res.status(400).json({ error: 'ID é obrigatório e deve ser um número inteiro positivo.' });
    }

    if (!nome_municipio && !status_infra && !periodo_visita && !status_visita && !status_publicacao && !status_instalacao && !publicacao && !periodo_instalacao) {
      return res.status(400).json({ error: 'Pelo menos um campo deve ser fornecido para atualização.' });
    }

    if (!token) {
      return res.status(400).json({ error: 'Token inválido' });
    }

    if (periodo_visita && isNaN(Date.parse(periodo_visita))) {
      return res.status(400).json({ error: 'Formato de periodo_visita inválido. Use YYYY-MM-DD.' });
    }

    if (publicacao && isNaN(Date.parse(publicacao))) {
      return res.status(400).json({ error: 'Formato de publicacao inválido. Use YYYY-MM-DD.' });
    }

    if (periodo_instalacao && isNaN(Date.parse(periodo_instalacao))) {
      return res.status(400).json({ error: 'Formato de instalacao inválido. Use YYYY-MM-DD.' });
    }

    if (status_visita && !Object.values(StatusVisita).includes(status_visita)) {
      return res.status(400).json({ error: 'status_visita deve ser Aprovado ou Reprovado.' });
    }

    if (status_publicacao && !Object.values(StatusPublicacao).includes(status_publicacao)) {
      return res.status(400).json({ error: 'status_publicacao deve ser publicado ou aguardando_publicacao.' });
    }

    if (status_instalacao && !Object.values(StatusInstalacao).includes(status_instalacao)) {
      return res.status(400).json({ error: 'status_instalacao deve ser instalado ou aguardando_instalacao.' });
    }

    const service = new UpdateAmploGeralService();

    try {
      const result = await service.execute(
        {
          id: Number(id),
          nome_municipio,
          status_infra,
          periodo_visita: periodo_visita ? new Date(periodo_visita) : undefined,
          status_visita,
          status_publicacao,
          status_instalacao,
          publicacao: publicacao ? new Date(publicacao) : undefined,
          periodo_instalacao: periodo_instalacao ? new Date(periodo_instalacao) : undefined,
        },
        token
      );
      return res.status(200).json(result);
    } catch (error: any) {
      return res.status(400).json({ error: error.message });
    }
  }
}