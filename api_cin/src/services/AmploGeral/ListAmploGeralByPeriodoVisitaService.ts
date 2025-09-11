import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export class ListAmploGeralByPeriodoVisitaService{
    async execute(periodo_visita: string){
        if(!periodo_visita || isNaN(Date.parse(periodo_visita))){
            throw new Error('Data do periodo da visita inválida')
        }

        const amploGeralVisita = await prisma.cin_amplo_geral.findMany({
            where:{
                periodo_visita:{
                    equals: new Date(periodo_visita),
                },
            },
        });

        return amploGeralVisita;
    };
};