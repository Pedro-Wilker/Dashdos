/*
  Warnings:

  - Added the required column `instalacao` to the `cin_amplo_geral` table without a default value. This is not possible if the table is not empty.
  - Added the required column `publicacao` to the `cin_amplo_geral` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "cin_amplo_geral" ADD COLUMN     "instalacao" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "publicacao" TIMESTAMP(3) NOT NULL;
