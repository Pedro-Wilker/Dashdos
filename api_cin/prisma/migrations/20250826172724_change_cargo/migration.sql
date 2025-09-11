/*
  Warnings:

  - The values [USER_CARTA] on the enum `Cargo` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "Cargo_new" AS ENUM ('ADMIN', 'DIRETORIA', 'SAC', 'CARTA', 'ARTICULACAO', 'NGA', 'PONTOS', 'CAPITAL', 'INTERIOR', 'NUD', 'MOVEL', 'CIN');
ALTER TABLE "User" ALTER COLUMN "cargo" TYPE "Cargo_new" USING ("cargo"::text::"Cargo_new");
ALTER TYPE "Cargo" RENAME TO "Cargo_old";
ALTER TYPE "Cargo_new" RENAME TO "Cargo";
DROP TYPE "Cargo_old";
COMMIT;
