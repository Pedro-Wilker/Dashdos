import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class ListAmploGeralByDataInstalacao {
  async execute() {
    const hoje = new Date();
    const seteDiasAntes = new Date();
    seteDiasAntes.setDate(hoje.getDate() - 7);

    const cidadesInstaladas = await prisma.cin_amplo_geral.findMany({
      where: {
        periodo_instalacao: {
          gte: seteDiasAntes,
          lte: hoje,
        },
      },
    });

    return cidadesInstaladas;
  }
}