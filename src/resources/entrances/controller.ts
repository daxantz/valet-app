import { Request, Response, NextFunction } from 'express'
import { createEntrance, deleteEntranceById, getAllEntrancesByLocation } from '../../services/entranceService'

const makeEntrance = async (req: Request, res: Response, next: NextFunction) => {
  console.log('Request body:', req.params, req.body)
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

const getEntrancesByLocation = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // logic to get all entrances
    const { locationId } = req.params
    if (!locationId) {
      return res.status(400).json({ error: 'Location ID is required' })
    }

    const entrances = await getAllEntrancesByLocation(parseInt(locationId))
    res.status(200).json({ message: 'Get all entrances ', entrances: entrances })
  } catch (error) {
    next(error)
  }
}

const deleteEntrance = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params
    if (!id) {
      return res.status(400).json({ error: 'Entrance ID is required' })
    }

    const entrance = await deleteEntranceById(parseInt(id))

    if (!entrance) {
      return res.status(404).json({ error: 'Entrance not found' })
    }
    // logic to delete an entrance
    res.status(200).json({ message: `Delete entrance:  ${id} `, entrance: entrance })
  } catch (error) {
    next(error)
  }
}
export default {
  makeEntrance,
  getEntrancesByLocation,
  deleteEntrance,
}
