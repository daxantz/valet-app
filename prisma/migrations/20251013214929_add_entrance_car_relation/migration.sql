/*
  Warnings:

  - Added the required column `entranceId` to the `Car` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."Car" ADD COLUMN     "entranceId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "public"."Car" ADD CONSTRAINT "Car_entranceId_fkey" FOREIGN KEY ("entranceId") REFERENCES "public"."Entrance"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
