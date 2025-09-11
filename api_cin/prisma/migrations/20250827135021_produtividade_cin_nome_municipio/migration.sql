/*
  Warnings:

  - A unique constraint covering the columns `[nome_municipio]` on the table `produtividade_diaria_cin` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "produtividade_diaria_cin_nome_municipio_key" ON "produtividade_diaria_cin"("nome_municipio");
