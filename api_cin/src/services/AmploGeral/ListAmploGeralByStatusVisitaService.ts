import { PrismaClient, StatusVisita } from '@prisma/client';

const prisma = new PrismaClient();

export class ListAmploGeralByStatusVisitaService {
  async execute(status_visita: StatusVisita) {
    if (!status_visita) {
      throw new Error('É necessário informar o status da visita');
    }

    const amploGeralVisita = await prisma.cin_amplo_geral.findMany({
      where: {
        status_visita: {
          equals: status_visita,
        },
      },
    });

    return amploGeralVisita;
  }
}