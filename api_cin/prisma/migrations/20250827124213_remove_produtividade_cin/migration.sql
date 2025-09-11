/*
  Warnings:

  - You are about to drop the `produtividade_cin` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "produtividade_cin" DROP CONSTRAINT "produtividade_cin_nome_municipio_fkey";

-- DropTable
DROP TABLE "produtividade_cin";
