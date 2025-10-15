import prisma from './prisma'
import { Car, CarStatus } from '@prisma/client'

/**
 * Create a new car
 */
export const makeCar = async (
  ticket: string,
  phoneNumber: string,
  entranceId: number,
  optionalData: {
    make?: string
    color?: string
    imageUrls?: string[]
  },
): Promise<Car> => {
  try {
    const { make, color, imageUrls } = optionalData

    const car = await prisma.car.create({
      data: {
        ticket,
        phoneNumber,
        make,
        color,
        images: {
          create: imageUrls?.map((url) => ({ url })) || [],
        },
        entrance: { connect: { id: entranceId } },
      },
    })

    return car
  } catch (err) {
    console.error('Error in createCar:', err)
    throw err
  }
}

/**
 * Get all cars
 */
export const getAllCarsByEntrance = async (entranceId: number): Promise<Car[]> => {
  try {
    const cars = await prisma.car.findMany({
      where: { entranceId },
      include: {
        images: true, // optional: include car images
        parkedBy: true,
        checkedOutBy: true,
      },
    })
    return cars
  } catch (err) {
    console.error('Error in getCarsByEntrance:', err)
    throw err
  }
}

/**
 * Get a single car by ID
 */
export const getCarById = async (id: number, entranceId: number): Promise<Car | null> => {
  try {
    return await prisma.car.findUnique({
      where: { id, entrance: { id: entranceId } },
      include: { images: true, parkedBy: true, checkedOutBy: true },
    })
  } catch (err) {
    console.error('Error in getCarById:', err)
    throw err
  }
}

/**
 * Update a car's details
 */
export const updateCar = async (
  id: number,
  updates: Partial<Omit<Car, 'id' | 'createdAt' | 'updatedAt'>>,
): Promise<Car> => {
  try {
    const car = await prisma.car.update({
      where: { id },
      data: updates,
      include: { images: true },
    })
    return car
  } catch (err) {
    console.error('Error in updateCar:', err)
    throw err
  }
}

/**
 * Update car status (e.g., PARKED → REQUESTED → READY → CHECKED_OUT)
 */
export const updateCarStatus = async (id: number, status: CarStatus): Promise<Car> => {
  try {
    const car = await prisma.car.update({
      where: { id },
      data: { status },
    })
    return car
  } catch (err) {
    console.error('Error in updateCarStatus:', err)
    throw err
  }
}

/**
 * Delete a car by ID
 */
export const deleteCar = async (id: number, entranceId: number): Promise<Car> => {
  try {
    return await prisma.car.delete({ where: { id, entrance: { id: entranceId } } })
  } catch (err) {
    console.error('Error in deleteCar:', err)
    throw err
  }
}

/**
 * Add an image to a car
 */
export const addCarImage = async (carId: number, imageUrl: string) => {
  try {
    return await prisma.carImage.create({
      data: {
        url: imageUrl,
        carId,
      },
    })
  } catch (err) {
    console.error('Error in addCarImage:', err)
    throw err
  }
}

/**
 * Remove a specific car image
 */
export const deleteCarImage = async (imageId: number) => {
  try {
    return await prisma.carImage.delete({
      where: { id: imageId },
    })
  } catch (err) {
    console.error('Error in deleteCarImage:', err)
    throw err
  }
}
