// src/services/entranceService.ts
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// Get all entrances
export const getAllEntrances = async () => {
  return prisma.entrance.findMany({
    include: {
      location: true, // include related Location
    },
  })
}

// Get a single entrance by ID
export const getEntranceById = async (id: number) => {
  return prisma.entrance.findUnique({
    where: { id },
    include: {
      location: true,
    },
  })
}

// Create a new entrance
export const createEntrance = async (name: string, locationId: number) => {
  return prisma.entrance.create({
    data: {
      name,
      locationId,
    },
    include: {
      location: true,
    },
  })
}

// Update an entrance
export const updateEntrance = async (id: number, name: string, locationId: number) => {
  return prisma.entrance.update({
    where: { id },
    data: {
      name,
      locationId,
    },
    include: {
      location: true,
    },
  })
}

// Delete an entrance
export const deleteEntrance = async (id: number) => {
  return prisma.entrance.delete({
    where: { id },
  })
}
