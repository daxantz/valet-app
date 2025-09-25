import { Request, Response, NextFunction } from 'express'
import { createEntrance } from '../../services/entranceService'

const makeEntrance = async (req: Request, res: Response, next: NextFunction) => {
  console.log('Request body:', req.body)
  try {
    const { name } = req.body
    const { locationId } = req.params
    if (!name) {
      return res.status(400).json({ error: 'Name is required' })
    }
    const entrance = await createEntrance(name, parseInt(locationId))
    // logic to create a new entrance
    res.status(201).json({ message: `Entrance created successfully: ${entrance.name}` })
  } catch (error) {
    next(error)
  }
}
export default {
  makeEntrance,
}
