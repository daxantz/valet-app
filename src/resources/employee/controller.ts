import { Request, Response, NextFunction } from 'express'
import { createEmployee } from '../../services/employeeService'
import prisma from '../../services/prisma'
const makeEmployee = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, pin } = req.body
    const { locationId } = req.params

    if (!name || !pin) {
      return res.status(400).json({ error: 'Name and Pin are required' })
    }

    // Check if the PIN already exists
    const existingEmployee = await prisma.employee.findUnique({ where: { pin } })
    if (existingEmployee) {
      return res.status(409).json({ error: 'An employee with this PIN already exists' })
    }

    const newEmployee = await createEmployee(name, pin, parseInt(locationId))

    res.status(201).json({ message: 'Employee created', employee: newEmployee })
  } catch (error) {
    next(error)
  }
}

export default { makeEmployee }
