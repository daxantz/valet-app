import prisma from './prisma'

export const createLocation = async (name: string) => {
  return prisma.location.create({
    data: { name },
  })
}

export const getLocationById = async (id: number) => {
  return prisma.location.findUnique({
    where: { id },
    include: { entrances: true },
  })
}

export const getAllLocations = async () => {
  return prisma.location.findMany({
    include: { entrances: true },
  })
}

export const updateLocationName = async (id: number, name: string) => {
  return prisma.location.update({
    where: { id },
    data: { name },
  })
}

export const deleteLocation = async (id: number) => {
  return prisma.location.delete({ where: { id } })
}
