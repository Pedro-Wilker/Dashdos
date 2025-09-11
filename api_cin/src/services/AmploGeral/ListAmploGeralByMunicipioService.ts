import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class ListByNomeMunicipioAmploGeralService {
  async execute(nome_municipio: string) {
    const amploGeral = await prisma.cin_amplo_geral.findMany({
      where: {
        nome_municipio: {
          contains: nome_municipio,
          mode: 'insensitive',
        },
      },
      include: {
        produtividades_diarias: true,
      },
    });

    return amploGeral;
  }
}