import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class ListAllAmploGeralService {
  async execute() {
    const amploGeral = await prisma.cin_amplo_geral.findMany();
    return amploGeral;
  }
}