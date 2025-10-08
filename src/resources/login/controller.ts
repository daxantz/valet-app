import { Request, Response, NextFunction } from 'express'
import prisma from '../../services/prisma'
import jwt from 'jsonwebtoken'
// import { getLocationById, getAllLocations, updateLocationName } from './service'
// import { Location } from '@prisma/client'

const loginLocation = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name } = req.body

    if (!name) {
      return res.status(400).json({ error: 'Location name is required' })
    }
    // get location by name
    const location = await prisma.location.findFirst({
      where: { name },
    })
    if (!location) {
      return res.status(404).json({ error: 'Location not found' })
    }
    // Ensure JWT secret is defined
    const jwtSecret = process.env.JWT_SECRET
    if (!jwtSecret) {
      console.error('JWT_SECRET not defined')
      return res.status(500).json({ error: 'Server configuration error' })
    }

    // Sign JWT synchronously (safe for small payloads)
    const token = jwt.sign({ locationId: location.id }, jwtSecret, { expiresIn: '8h' })

    // Set cookie safely for dev and prod
    res.cookie('token', token, {
      httpOnly: true,
      secure: false, // will only be secure in production
      maxAge: 8 * 60 * 60 * 1000, // 8 hours
      sameSite: 'lax',
    })

    // Always send JSON response
    return res.status(200).json({
      message: 'Login successful',
      location: { id: location.id, name: location.name },
    })
  } catch (error) {
    console.error('Login error:', error)
    return next(error)
  }
}

export default { loginLocation }
