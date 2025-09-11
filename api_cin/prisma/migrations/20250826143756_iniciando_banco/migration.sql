-- CreateEnum
CREATE TYPE "public"."Cargo" AS ENUM ('ADMIN', 'DIRETORIA', 'SAC', 'USER_CARTA', 'ARTICULACAO', 'NGA', 'PONTOS', 'CAPITAL', 'INTERIOR', 'NUD', 'MOVEL');

-- CreateTable
CREATE TABLE "public"."User" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "cargo" "public"."Cargo" NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "createAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updateAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."cin_amplo_geral" (
    "id" SERIAL NOT NULL,
    "nome_municipio" TEXT NOT NULL,
    "status_infra" TEXT NOT NULL,
    "periodo_visita" TIMESTAMP(3) NOT NULL,
    "status_visita" TEXT NOT NULL,
    "publicacao" TIMESTAMP(3) NOT NULL,
    "instalacao" TIMESTAMP(3) NOT NULL,
    "createAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updateAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "cin_amplo_geral_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."produtividade_cin" (
    "id" SERIAL NOT NULL,
    "nome_municipio" TEXT NOT NULL,
    "ano" INTEGER NOT NULL,
    "janeiro" INTEGER DEFAULT 0,
    "fevereiro" INTEGER DEFAULT 0,
    "marco" INTEGER DEFAULT 0,
    "abril" INTEGER DEFAULT 0,
    "maio" INTEGER DEFAULT 0,
    "junho" INTEGER DEFAULT 0,
    "julho" INTEGER DEFAULT 0,
    "agosto" INTEGER DEFAULT 0,
    "setembro" INTEGER DEFAULT 0,
    "outubro" INTEGER DEFAULT 0,
    "novembro" INTEGER DEFAULT 0,
    "dezembro" INTEGER DEFAULT 0,
    "createAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updateAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "produtividade_cin_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."produtividade_diaria_cin" (
    "id" SERIAL NOT NULL,
    "nome_municipio" TEXT NOT NULL,
    "data" TIMESTAMP(3) NOT NULL,
    "quantidade" INTEGER NOT NULL,
    "createAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updateAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "produtividade_diaria_cin_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "public"."User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "cin_amplo_geral_nome_municipio_key" ON "public"."cin_amplo_geral"("nome_municipio");

-- CreateIndex
CREATE INDEX "produtividade_diaria_cin_data_idx" ON "public"."produtividade_diaria_cin"("data");

-- AddForeignKey
ALTER TABLE "public"."produtividade_cin" ADD CONSTRAINT "produtividade_cin_nome_municipio_fkey" FOREIGN KEY ("nome_municipio") REFERENCES "public"."cin_amplo_geral"("nome_municipio") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."produtividade_diaria_cin" ADD CONSTRAINT "produtividade_diaria_cin_nome_municipio_fkey" FOREIGN KEY ("nome_municipio") REFERENCES "public"."cin_amplo_geral"("nome_municipio") ON DELETE RESTRICT ON UPDATE CASCADE;
