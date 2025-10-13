import request from 'supertest'
import app from '../src/app'
import prisma from '../src/services/prisma'
import { Car } from '@prisma/client'

beforeEach(async () => {
  // Clear tables with foreign keys first
  await prisma.car.deleteMany() // Since Car relates to Employee
  await prisma.employee.deleteMany()
  await prisma.entrance.deleteMany()

  // Then clear tables without dependencies
  await prisma.location.deleteMany()
})

test('GET /v1/location/:locationId/entrance/:entranceId/car retrieves cars for an entrance', async () => {
  // Create a location, entrance, and cars
  const location = await prisma.location.create({ data: { name: 'Test Location - get cars' } })
  const entrance = await prisma.entrance.create({
    data: { name: 'Main Entrance', locationId: location.id },
  })
  await prisma.car.createMany({
    data: [
      { ticket: 'TICKET1', phoneNumber: '1234567890', entranceId: entrance.id, make: 'Toyota', color: 'Red' },
      { ticket: 'TICKET2', phoneNumber: '0987654321', entranceId: entrance.id, make: 'Honda', color: 'Blue' },
    ],
  })

  const res = await request(app).get(`/v1/location/${location.id}/entrance/${entrance.id}/car`)

  expect(res.status).toBe(200)
  expect(res.body).toHaveProperty('message', `retrieved all cars from entrance: ${entrance.id}`)
  expect(res.body.cars).toHaveLength(2)
  const tickets = res.body.cars.map((car: Car) => car.ticket)
  expect(tickets).toContain('TICKET1')
  expect(tickets).toContain('TICKET2')
})
