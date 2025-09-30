import request from 'supertest'
import app from '../src/app'
import prisma from '../src/services/prisma'

beforeEach(async () => {
  // Clear tables with foreign keys first
  await prisma.car.deleteMany() // Since Car relates to Employee
  await prisma.employee.deleteMany()
  await prisma.entrance.deleteMany()

  // Then clear tables without dependencies
  await prisma.location.deleteMany()
})

test('POST /v1/location/:locationId/employee creates a new employee', async () => {
  // First, create a location to associate with the employee
  const location = await prisma.location.create({ data: { name: 'Test Location - employee' } })

  const res = await request(app).post(`/v1/location/${location.id}/employee`).send({ name: 'John Doe', pin: '1234' })

  expect(res.status).toBe(201)
  expect(res.body).toHaveProperty('message', 'Employee created')
  expect(res.body.employee).toHaveProperty('name', 'John Doe')
  expect(res.body.employee).toHaveProperty('pin', '1234')
  expect(res.body.employee).toHaveProperty('locationId', location.id)

  // Verify it exists in the DB
  const employeeInDb = await prisma.employee.findFirst({ where: { pin: '1234' } })
  expect(employeeInDb).not.toBeNull()
  expect(employeeInDb?.locationId).toBe(location.id)
})
