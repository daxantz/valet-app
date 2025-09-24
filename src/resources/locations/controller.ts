import { Request, Response, NextFunction } from 'express'
import { createLocation } from '../../services/locationService'

const getAll = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // use dummy data for now
    const users = ['John Doe', 'Jane Doe', 'John Smith', 'Jane Smith']
    res.status(200).json(users)
  } catch (error) {
    next(error)
  }
}

const makeLocation = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.body.name) {
      return res.status(400).json({ error: 'Name is required' })
    }
    const location = await createLocation(req.body.name)
    // logic to create a new location
    res.status(201).json({ message: `Location created successfully: ${location.name}` })
  } catch (error) {
    next(error)
  }
}
export default {
  getAll,
  makeLocation,
}
