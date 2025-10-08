import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'
/* eslint-disable @typescript-eslint/no-explicit-any */
const verifyLocationToken = (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.headers.authorization?.split(' ')[1]
    if (!token) {
      return res.status(401).json({ error: 'Invalid or expired token' })
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as jwt.JwtPayload
    if (!decoded) {
      return res.status(401).json({ error: 'Invalid token payload' })
    }
    ;(req as any).location = decoded.locationId
    console.log(decoded)
    next()
  } catch (error) {
    return res.status(401).json({ error: 'Invalid or expired token' })
  }
}

export default verifyLocationToken
