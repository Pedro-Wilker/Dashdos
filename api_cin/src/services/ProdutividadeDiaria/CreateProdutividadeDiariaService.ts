import { Cargo, PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();

interface CreateProdutividadeDiariaData {
  cin_amplo_geral_id: number;
  data: Date;
  quantidade: number;
}

export class CreateProdutividadeDiaria {
  async execute({ cin_amplo_geral_id, data, quantidade }: CreateProdutividadeDiariaData, token: string) {
    if (!process.env.JWT_SECRET) throw new Error('JWT_SECRET não foi configurada');

    let decoded: any;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
      throw new Error('Token inválido');
    }

    const allowedRoles = [Cargo.ADMIN, Cargo.DIRETORIA, Cargo.CARTA];
    if (!allowedRoles.includes(decoded.cargo)) {
      throw new Error('Usuário não tem permissão para criar estes dados.');
    }

    // Check if cin_amplo_geral_id exists in cin_amplo_geral
    const municipioExists = await prisma.cin_amplo_geral.findUnique({
      where: { id: cin_amplo_geral_id },
    });
    if (!municipioExists) {
      throw new Error('Município não encontrado em cin_amplo_geral');
    }

    // Check for duplicate record for the same city and date
    const existingRecord = await prisma.produtividade_diaria_cin.findFirst({
      where: {
        cin_amplo_geral_id,
        data: {
          gte: new Date(data.setHours(0, 0, 0, 0)),
          lte: new Date(data.setHours(23, 59, 59, 999)),
        },
      },
    });
    if (existingRecord) {
      throw new Error('Já existe um registro para este município e data');
    }

    const produtividadeDiaria = await prisma.produtividade_diaria_cin.create({
      data: {
        cin_amplo_geral_id,
        data,
        quantidade,
      },
    });

    return { message: 'Produtividade Criada', produtividadeId: produtividadeDiaria.id };
  }
}