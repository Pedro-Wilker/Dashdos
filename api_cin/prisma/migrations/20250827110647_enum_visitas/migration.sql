/*
  Warnings:

  - Changed the type of `status_visita` on the `cin_amplo_geral` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "StatusVisita" AS ENUM ('Aprovado', 'Reprovado');

-- AlterTable
ALTER TABLE "cin_amplo_geral" DROP COLUMN "status_visita",
ADD COLUMN     "status_visita" "StatusVisita" NOT NULL;
