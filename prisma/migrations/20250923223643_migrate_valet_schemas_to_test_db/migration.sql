-- CreateEnum
CREATE TYPE "public"."CarStatus" AS ENUM ('PARKED', 'REQUESTED', 'READY', 'CHECKED_OUT');

-- CreateTable
CREATE TABLE "public"."Location" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Location_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Entrance" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "locationId" INTEGER NOT NULL,

    CONSTRAINT "Entrance_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Employee" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "pin" TEXT NOT NULL,

    CONSTRAINT "Employee_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Car" (
    "id" SERIAL NOT NULL,
    "ticket" TEXT NOT NULL,
    "phoneNumber" TEXT NOT NULL,
    "make" TEXT NOT NULL,
    "model" TEXT NOT NULL,
    "color" TEXT NOT NULL,
    "status" "public"."CarStatus" NOT NULL DEFAULT 'PARKED',
    "requestedAt" TIMESTAMP(3),
    "readyAt" TIMESTAMP(3),
    "checkedOutAt" TIMESTAMP(3),
    "parkedById" INTEGER,
    "checkedOutById" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Car_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Employee_pin_key" ON "public"."Employee"("pin");

-- CreateIndex
CREATE UNIQUE INDEX "Car_ticket_key" ON "public"."Car"("ticket");

-- AddForeignKey
ALTER TABLE "public"."Entrance" ADD CONSTRAINT "Entrance_locationId_fkey" FOREIGN KEY ("locationId") REFERENCES "public"."Location"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Car" ADD CONSTRAINT "Car_parkedById_fkey" FOREIGN KEY ("parkedById") REFERENCES "public"."Employee"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Car" ADD CONSTRAINT "Car_checkedOutById_fkey" FOREIGN KEY ("checkedOutById") REFERENCES "public"."Employee"("id") ON DELETE SET NULL ON UPDATE CASCADE;
