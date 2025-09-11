/*
  Warnings:

  - Added the required column `cidade_visita` to the `cin_amplo_geral` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "cin_amplo_geral" ADD COLUMN     "cidade_visita" BOOLEAN NOT NULL,
ADD COLUMN     "data_instalacao" TIMESTAMP(3),
ADD COLUMN     "data_visita" TIMESTAMP(3),
ADD COLUMN     "periodo_instalacao" TIMESTAMP(3),
ALTER COLUMN "periodo_visita" DROP NOT NULL;
