import { Cargo, PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();

export class DeleteProdutividadeDiariaService {
  async execute(id: number, token: string) {
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
      throw new Error('Usuário não tem permissão para deletar produtividade diária');
    }

    const existingRecord = await prisma.produtividade_diaria_cin.findUnique({ where: { id } });
    if (!existingRecord) {
      throw new Error('Registro não encontrado');
    }

    await prisma.produtividade_diaria_cin.delete({ where: { id } });

    return { message: 'Produtividade diária deletada com sucesso' };
  }
}