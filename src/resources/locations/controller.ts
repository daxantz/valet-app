import { Request, Response, NextFunction } from 'express'
import { createLocation, deleteLocation, getAllLocations, getLocationById } from '../../services/locationService'

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

const removeLocation = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params
    if (!id) {
      return res.status(400).json({ error: 'Could not find this location' })
    }
    const deletedLocation = await deleteLocation(parseInt(id))

    // logic to delete a location by id
    res.status(200).json({ message: `Location: ${deletedLocation.name} deleted successfully` })
  } catch (error) {
    next(error)
  }
}

const getLocations = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const locations = await getAllLocations()

    if (!locations || locations.length === 0) {
      return res.status(404).json({ message: 'No locations found' })
    }
    // logic to get all locations
    res.status(200).json({ message: 'Retrieved all locations', locations: locations })
  } catch (error) {
    next(error)
  }
}

const getSingleLocation = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params
    if (!id) {
      return res.status(400).json({ error: 'Could not find this location' })
    }
    const location = await getLocationById(parseInt(id))
    if (!location) {
      return res.status(404).json({ message: 'Location not found' })
    }
    // logic to get a single location by id
    res.status(200).json({ message: `Retrieved location with id: ${id}`, location: location })
  } catch (error) {
    next(error)
  }
}
export default {
  getAll,
  makeLocation,
  removeLocation,
  getLocations,
  getSingleLocation,
}
