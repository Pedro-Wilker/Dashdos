import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class ListByInstalacaoAmploGeralService {
  async execute(instalacao: string) {
 
    console.log('Service instalacao:', instalacao);

    if (!instalacao || isNaN(Date.parse(instalacao))) {
      throw new Error('Data da instalação inválida.');
    }

    const targetDate = new Date(instalacao);
    const startOfDay = new Date(
      Date.UTC(
        targetDate.getUTCFullYear(),
        targetDate.getUTCMonth(),
        targetDate.getUTCDate(),
        0,
        0,
        0,
        0
      )
    );
    const endOfDay = new Date(
      Date.UTC(
        targetDate.getUTCFullYear(),
        targetDate.getUTCMonth(),
        targetDate.getUTCDate(),
        23,
        59,
        59,
        999
      )
    );

    console.log('Query range:', {
      startOfDay: startOfDay.toISOString(),
      endOfDay: endOfDay.toISOString(),
    });

    const amploGeral = await prisma.cin_amplo_geral.findMany({
      where: {
        periodo_instalacao: {
          gte: startOfDay,
          lte: endOfDay,
        },
      },
    });

    console.log('Found records:', amploGeral.length, 'Records:', amploGeral);

    return amploGeral;
  }
}