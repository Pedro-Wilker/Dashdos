import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class ListByIdAmploGeralService {
  async execute(id: number) {
    const amploGeral = await prisma.cin_amplo_geral.findUnique({
      where: { id },
    });

    if (!amploGeral) {
      throw new Error('O id de Amplo geral não foi encontrado ou não existe');
    }

    return amploGeral;
  }
}