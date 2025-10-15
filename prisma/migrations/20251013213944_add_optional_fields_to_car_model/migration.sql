/*
  Warnings:

  - You are about to drop the column `model` on the `Car` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."Car" DROP COLUMN "model",
ALTER COLUMN "make" DROP NOT NULL,
ALTER COLUMN "color" DROP NOT NULL;
