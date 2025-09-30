import { Request, Response, NextFunction } from 'express'
import { createEmployee, deleteEmployee, getEmployeeById } from '../../services/employeeService'
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

const getEmployees = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { locationId } = req.params
    if (!locationId) {
      return res.status(400).json({ error: 'Location ID is required' })
    }
    const employees = await prisma.employee.findMany({ where: { locationId: parseInt(locationId) } })
    res.status(200).json({ message: `Retrieved all employees for location ${locationId}`, employees })
  } catch (error) {
    next(error)
  }
}

const getSingleEmployee = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { employeeId } = req.params
    if (!employeeId) {
      return res.status(400).json({ error: 'Employee ID is required' })
    }
    const employee = await getEmployeeById(parseInt(employeeId))
    if (!employee) {
      return res.status(404).json({ error: 'Employee not found' })
    }

    res.status(200).json({ message: `Retrieved employee ${employeeId}`, employee })
  } catch (error) {
    next(error)
  }
}

const removeEmployee = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { employeeId } = req.params
    if (!employeeId) {
      return res.status(400).json({ error: 'Employee ID is required' })
    }
    const deletedEmployee = await deleteEmployee(parseInt(employeeId))
    if (!deletedEmployee) {
      return res.status(404).json({ error: 'Employee not found' })
    }
    res.status(200).json({ message: `Deleted employee ${employeeId}`, employee: deletedEmployee })
  } catch (error) {
    next(error)
  }
}

export default { makeEmployee, getEmployees, getSingleEmployee, removeEmployee }
