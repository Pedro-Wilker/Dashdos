import { Cargo, PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();

interface UpdateProdutividadeDiariaData {
  id: number;
  cin_amplo_geral_id?: number;
  data?: Date;
  quantidade?: number;
}

export class UpdateProdutividadeDiariaService {
  async execute({ id, cin_amplo_geral_id, data, quantidade }: UpdateProdutividadeDiariaData, token: string) {
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
      throw new Error('Usuário não tem permissão para atualizar produtividade diária');
    }

    const existingRecord = await prisma.produtividade_diaria_cin.findUnique({ where: { id } });
    if (!existingRecord) {
      throw new Error('Registro não encontrado');
    }

    if (cin_amplo_geral_id && cin_amplo_geral_id !== existingRecord.cin_amplo_geral_id) {
      const municipioExists = await prisma.cin_amplo_geral.findUnique({ where: { id: cin_amplo_geral_id } });
      if (!municipioExists) {
        throw new Error('Município não existe em cin_amplo_geral');
      }

      // Check for duplicate record for the new cin_amplo_geral_id and data
      if (data || cin_amplo_geral_id) {
        const checkData = data || existingRecord.data;
        const existingDuplicate = await prisma.produtividade_diaria_cin.findFirst({
          where: {
            cin_amplo_geral_id: cin_amplo_geral_id || existingRecord.cin_amplo_geral_id,
            data: {
              gte: new Date(checkData.setHours(0, 0, 0, 0)),
              lte: new Date(checkData.setHours(23, 59, 59, 999)),
            },
            NOT: { id }, // Exclude the current record
          },
        });
        if (existingDuplicate) {
          throw new Error('Já existe um registro para este município e data');
        }
      }
    }

    const updatedRecord = await prisma.produtividade_diaria_cin.update({
      where: { id },
      data: {
        cin_amplo_geral_id,
        data,
        quantidade,
      },
    });

    return { message: 'Produtividade diária atualizada', record: updatedRecord };
  }
}