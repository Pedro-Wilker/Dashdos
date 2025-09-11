import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export class ListAmploGeralPublicacaoService{
    async execute(publicacao:string){
        if(!publicacao || isNaN(Date.parse(publicacao))) "Data da publicação inválida."

        const amploGeralPublicacao = await prisma.cin_amplo_geral.findMany({
            where:{
                publicacao:{
                    equals: new Date(publicacao),
                },
            },
        });
  
        return amploGeralPublicacao;
    };
};