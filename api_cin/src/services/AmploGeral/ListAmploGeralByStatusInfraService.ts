import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export class ListAmploGeralByStatusInfraService {
    async execute(status_infra: string) {
        if (!status_infra) "É necessario digitar o status da infraestrutura"

        const amploGeralInfra = await prisma.cin_amplo_geral.findMany({
            where: {
                status_infra: {
                    contains: status_infra,
                    mode: 'insensitive',
                },
            },
        });

        return amploGeralInfra;
    };
};