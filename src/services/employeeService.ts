// src/services/employeeService.ts
import prisma from './prisma'
import { Employee } from '@prisma/client'

// Create a new employee for a location
export const createEmployee = async (name: string, pin: string, locationId: number) => {
  try {
    const employee = await prisma.employee.create({
      data: { name, pin, locationId },
    })
    return employee
  } catch (err) {
    console.error('Error in createEmployee:', err)
    throw err
  }
}

// Get a single employee by ID
export const getEmployeeById = async (id: number): Promise<Employee | null> => {
  try {
    return await prisma.employee.findUnique({ where: { id } })
  } catch (err) {
    console.error('Error in getEmployeeById:', err)
    throw err
  }
}

// Delete an employee
export const deleteEmployee = async (id: number): Promise<Employee> => {
  try {
    return await prisma.employee.delete({ where: { id } })
  } catch (err) {
    console.error('Error in deleteEmployee:', err)
    throw err
  }
}

// Get all employees for a specific location
export const getEmployeesByLocation = async (locationId: number): Promise<Employee[]> => {
  try {
    return await prisma.employee.findMany({ where: { locationId } })
  } catch (err) {
    console.error('Error in getEmployeesByLocation:', err)
    throw err
  }
}
