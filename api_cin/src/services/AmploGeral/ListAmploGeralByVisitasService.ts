import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class ListAmploGeralByVisitas {
  async execute() {
    const hoje = new Date();
    const seteDiasDepois = new Date();
    seteDiasDepois.setDate(hoje.getDate() + 7);

    const cidadesParaVisita = await prisma.cin_amplo_geral.findMany({
      where: {
        OR: [
          {
            cidade_visita: true,
            periodo_visita: {
              gte: hoje,
              lte: seteDiasDepois,
            },
          },
          {
            cidade_visita: false,
            data_visita: {
              gte: hoje,
              lte: seteDiasDepois,
            },
          },
        ],
      },
    });

    return cidadesParaVisita;
  }
}