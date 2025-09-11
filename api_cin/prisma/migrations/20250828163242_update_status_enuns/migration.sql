/*
  Warnings:

  - You are about to drop the column `instalacao` on the `cin_amplo_geral` table. All the data in the column will be lost.
  - You are about to drop the column `publicacao` on the `cin_amplo_geral` table. All the data in the column will be lost.
  - Added the required column `status_instalacao` to the `cin_amplo_geral` table without a default value. This is not possible if the table is not empty.
  - Added the required column `status_publicacao` to the `cin_amplo_geral` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "StatusPublicacao" AS ENUM ('publicado', 'aguardando_publicacao');

-- CreateEnum
CREATE TYPE "StatusInstalacao" AS ENUM ('instalado', 'aguardando_instalacao');

-- AlterTable
ALTER TABLE "cin_amplo_geral" DROP COLUMN "instalacao",
DROP COLUMN "publicacao",
ADD COLUMN     "status_instalacao" "StatusInstalacao" NOT NULL,
ADD COLUMN     "status_publicacao" "StatusPublicacao" NOT NULL;
