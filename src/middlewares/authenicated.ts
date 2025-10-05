import { NextFunction, Request, Response } from 'express'
import jwt from 'jsonwebtoken'
export const authenticate = (req: Request, res: Response, next: NextFunction) => {
  try {
    console.log('Authenticating request...')
    const authHeader = req.headers.authorization
    if (!authHeader) {
      return res.status(401).json({ error: 'Authorization header missing' })
    }

    const token = authHeader.split(' ')[1]
    if (!token) {
      return res.status(401).json({ error: 'Token missing' })
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as { employeeId: number }
    req.cookies = decoded.employeeId

    next()
  } catch (error) {
    return res.status(401).json({ error: 'Invalid or expired token' })
  }
}

export default authenticate
