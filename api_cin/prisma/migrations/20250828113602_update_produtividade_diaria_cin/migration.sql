/*
  Warnings:

  - You are about to drop the column `nome_municipio` on the `produtividade_diaria_cin` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[cin_amplo_geral_id,data]` on the table `produtividade_diaria_cin` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `cin_amplo_geral_id` to the `produtividade_diaria_cin` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "produtividade_diaria_cin" DROP CONSTRAINT "produtividade_diaria_cin_nome_municipio_fkey";

-- DropIndex
DROP INDEX "produtividade_diaria_cin_nome_municipio_key";

-- AlterTable
ALTER TABLE "produtividade_diaria_cin" DROP COLUMN "nome_municipio",
ADD COLUMN     "cin_amplo_geral_id" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "produtividade_diaria_cin_cin_amplo_geral_id_data_key" ON "produtividade_diaria_cin"("cin_amplo_geral_id", "data");

-- AddForeignKey
ALTER TABLE "produtividade_diaria_cin" ADD CONSTRAINT "produtividade_diaria_cin_cin_amplo_geral_id_fkey" FOREIGN KEY ("cin_amplo_geral_id") REFERENCES "cin_amplo_geral"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
