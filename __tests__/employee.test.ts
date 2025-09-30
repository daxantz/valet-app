import request from 'supertest'
import app from '../src/app'
import prisma from '../src/services/prisma'
import { Employee } from '@prisma/client'

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

test('GET /v1/location/:locationId/employee retrieves employees for a location', async () => {
  // Create a location and employees
  const location = await prisma.location.create({ data: { name: 'Test Location - get employees' } })
  await prisma.employee.createMany({
    data: [
      { name: 'Alice', pin: '1111', locationId: location.id },
      { name: 'Bob', pin: '2222', locationId: location.id },
    ],
  })

  const res = await request(app).get(`/v1/location/${location.id}/employee`)

  expect(res.status).toBe(200)
  expect(res.body).toHaveProperty('message', `Retrieved all employees for location ${location.id}`)
  expect(res.body.employees).toHaveLength(2)
  const pins = res.body.employees.map((emp: Employee) => emp.pin)
  expect(pins).toContain('1111')
  expect(pins).toContain('2222')
})

test('GET /v1/location/:locationId/employee/:id retrieves a single employee', async () => {
  // Create a location and an employee
  const location = await prisma.location.create({ data: { name: 'Test Location - get single employee' } })
  const employee = await prisma.employee.create({
    data: { name: 'Charlie', pin: '3333', locationId: location.id },
  })

  const res = await request(app).get(`/v1/location/${location.id}/employee/${employee.id}`)

  expect(res.status).toBe(200)
  expect(res.body).toHaveProperty('message', `Retrieved employee ${employee.id}`)
  expect(res.body.employee).toHaveProperty('name', 'Charlie')
  expect(res.body.employee).toHaveProperty('pin', '3333')
  expect(res.body.employee).toHaveProperty('locationId', location.id)
})

test('DELETE /v1/location/:locationId/employee/:id deletes an employee', async () => {
  // Create a location and an employee
  const location = await prisma.location.create({ data: { name: 'Test Location - delete employee' } })
  const employee = await prisma.employee.create({
    data: { name: 'Dave', pin: '4444', locationId: location.id },
  })

  const res = await request(app).delete(`/v1/location/${location.id}/employee/${employee.id}`)

  expect(res.status).toBe(200)
  expect(res.body).toHaveProperty('message', `Deleted employee ${employee.id}`)
  expect(res.body.employee).toHaveProperty('id', employee.id)

  // Verify it's deleted from the DB
  const employeeInDb = await prisma.employee.findUnique({ where: { id: employee.id } })
  expect(employeeInDb).toBeNull()
})

test('PUT /v1/location/:locationId/employee/:id updates an employee', async () => {
  // Create a location and an employee
  const location = await prisma.location.create({ data: { name: 'Test Location - update employee' } })
  const employee = await prisma.employee.create({
    data: { name: 'Eve', pin: '5555', locationId: location.id },
  })

  const res = await request(app)
    .put(`/v1/location/${location.id}/employee/${employee.id}`)
    .send({ updatedName: 'Eve Updated', pin: '9999' })

  expect(res.status).toBe(200)
  expect(res.body).toHaveProperty('message', `Updated employee ${employee.id}`)
  expect(res.body.employee).toHaveProperty('name', 'Eve Updated')
  expect(res.body.employee).toHaveProperty('pin', '9999')

  // Verify the updates in the DB
  const employeeInDb = await prisma.employee.findUnique({ where: { id: employee.id } })
  expect(employeeInDb).not.toBeNull()
  expect(employeeInDb?.name).toBe('Eve Updated')
  expect(employeeInDb?.pin).toBe('9999')
})
