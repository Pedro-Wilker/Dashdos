import { PrismaClient, StatusVisita, Cargo, StatusPublicacao, StatusInstalacao } from '@prisma/client';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();

interface UpdateAmploGeralData {
  id: number;
  nome_municipio?: string;
  status_infra?: string;
  periodo_visita?: Date;
  status_visita?: StatusVisita;
  status_publicacao?: StatusPublicacao;
  status_instalacao?: StatusInstalacao;
  publicacao?: Date;
  periodo_instalacao?: Date;
}

export class UpdateAmploGeralService {
  async execute({ id, nome_municipio, status_infra, periodo_visita, status_visita, status_publicacao, status_instalacao, publicacao, periodo_instalacao }: UpdateAmploGeralData, token: string) {
    if (!process.env.JWT_SECRET) {
      throw new Error('JWT_SECRET não configurada');
    }

    let decoded: any;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
      throw new Error('Token inválido');
    }

    const allowedRoles = [Cargo.ADMIN, Cargo.DIRETORIA, Cargo.CARTA];
    if (!allowedRoles.includes(decoded.cargo)) {
      throw new Error('Usuário não tem permissão para atualizar Amplo Geral');
    }

    const existingRecord = await prisma.cin_amplo_geral.findUnique({ where: { id } });
    if (!existingRecord) {
      throw new Error('Amplo Geral não encontrado');
    }

    if (nome_municipio && nome_municipio !== existingRecord.nome_municipio) {
      const municipioExists = await prisma.cin_amplo_geral.findUnique({ where: { nome_municipio } });
      if (municipioExists) {
        throw new Error('Este nome de município já está cadastrado');
      }
    }

    const updateAmploGeral = await prisma.cin_amplo_geral.update({
      where: { id },
      data: {
        nome_municipio,
        status_infra,
        periodo_visita,
        status_visita,
        status_publicacao,
        status_instalacao,
        publicacao,
        periodo_instalacao,
      },
    });

    return { message: 'Amplo Geral atualizado', amploGeral: updateAmploGeral };
  }
}