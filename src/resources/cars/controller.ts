import { Request, Response, NextFunction } from 'express'
import { getAllCarsByEntrance, deleteCar, getCarById, makeCar } from '../../services/carService'
import prisma from '../../services/prisma'

interface S3File extends Express.Multer.File {
  location: string // S3 URL
}

const getCars = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { entranceId } = req.params
    if (!entranceId) {
      return res.status(400).json({ message: 'Entrance ID is required' })
    }
    // Call service method to get cars by entranceId
    const cars = await getAllCarsByEntrance(parseInt(entranceId))
    // logic to get all cars
    res.status(200).json({ message: `retrieved all cars from entrance: ${entranceId}`, cars: cars })
  } catch (error) {
    next(error)
  }
}

const removeCar = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id, entranceId } = req.params
    if (!entranceId) {
      return res.status(400).json({ message: 'Entrance ID is required' })
    }
    if (!id) {
      return res.status(400).json({ message: 'Car ID is required' })
    }
    const car = await deleteCar(parseInt(id), parseInt(entranceId))

    // logic to delete a car by ID
    res.status(200).json({ message: `deleted car with id: ${car.id}` })
  } catch (error) {
    next(error)
  }
}

const getSingleCar = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id, entranceId } = req.params
    if (!id) {
      return res.status(400).json({ message: 'Car ID is required' })
    }
    if (!entranceId) {
      return res.status(400).json({ message: 'Entrance ID is required' })
    }
    const car = await getCarById(parseInt(id), parseInt(entranceId))
    if (!car) {
      return res.status(404).json({ message: `Car with id: ${id} not found` })
    }
    // logic to get a single car by ID
    res.status(200).json({ message: `retrieved car with id: ${id}`, car: car })
  } catch (error) {
    next(error)
  }
}

const createCar = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { ticket, phoneNumber, make, color } = req.body
    const { entranceId } = req.params
    if (!entranceId) {
      return res.status(400).json({ message: 'Entrance ID is required' })
    }

    if (!ticket || !phoneNumber) {
      return res.status(400).json({ message: 'Ticket and Phone Number are required' })
    }

    const imageUrls = (req.files as S3File[]).map((file) => file.location)
    //check to see if ticket exits
    const existingTicket = await prisma.car.findFirst({ where: { ticket } })

    if (existingTicket) {
      return res.status(400).json({ message: `Duplicate ticket number: ${ticket}` })
    }
    // Call service method to create a new car
    const car = await makeCar(ticket, phoneNumber, parseInt(entranceId), { make, color, imageUrls })

    res.status(201).json({ message: 'Car created successfully', car: car })
  } catch (error) {
    next(error)
  }
}

export default { getCars, removeCar, getSingleCar, createCar }
