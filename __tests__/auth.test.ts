import request from 'supertest'
import app from '../src/app'
import prisma from '../src/services/prisma'

test('Login with valid credentials', async () => {
  // First, create a test location and employee in the database
  const location = await prisma.location.create({ data: { name: 'Test Location' } })
  const employee = await prisma.employee.create({
    data: { name: 'Test Employee', pin: '1234', locationId: location.id },
  })

  const res = await request(app).post(`/v1/location/${location.id}/auth/login`).send({ pin: '1234' })

  expect(res.status).toBe(200)
  expect(res.body).toHaveProperty('message', 'Login successful')
  expect(res.body).toHaveProperty('employee')
  expect(res.body.employee).toHaveProperty('id', employee.id)
  expect(res.body.employee).toHaveProperty('name', 'Test Employee')
  expect(res.headers['set-cookie']).toBeDefined()

  // Clean up
  await prisma.employee.delete({ where: { id: employee.id } })
  await prisma.location.delete({ where: { id: location.id } })
})
