import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'
import prisma from '../../services/prisma'

const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { locationId } = req.params
    const { pin } = req.body

    if (!locationId) {
      return res.status(400).json({ error: 'Location ID is required' })
    }
    if (!pin) {
      return res.status(400).json({ error: 'PIN is required' })
    }

    const employee = await prisma.employee.findFirst({
      where: { locationId: parseInt(locationId), pin },
    })

    if (!employee) {
      return res.status(401).json({ error: 'Invalid PIN or location' })
    }

    // Ensure JWT secret is defined
    const jwtSecret = process.env.JWT_SECRET
    if (!jwtSecret) {
      console.error('JWT_SECRET not defined')
      return res.status(500).json({ error: 'Server configuration error' })
    }

    // Sign JWT synchronously (safe for small payloads)
    const token = jwt.sign({ employeeId: employee.id }, jwtSecret, { expiresIn: '8h' })

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
      employee: { id: employee.id, name: employee.name },
    })
  } catch (error) {
    console.error('Login error:', error)
    return next(error)
  }
}

export default {
  login,
}
