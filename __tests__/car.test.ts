import request from 'supertest'
import app from '../src/app'
import prisma from '../src/services/prisma'
import { Car } from '@prisma/client'
import path from 'path'

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

test('DELETE /v1/location/:locationId/entrance/:entranceId/car/:id deletes a car', async () => {
  // Create a location, entrance, and a car
  const location = await prisma.location.create({ data: { name: 'Test Location - delete car' } })
  const entrance = await prisma.entrance.create({
    data: { name: 'Side Entrance', locationId: location.id },
  })
  const car = await prisma.car.create({
    data: { ticket: 'TICKET3', phoneNumber: '5555555555', entranceId: entrance.id, make: 'Ford', color: 'Black' },
  })

  const res = await request(app).delete(`/v1/location/${location.id}/entrance/${entrance.id}/car/${car.id}`)

  expect(res.status).toBe(200)
  expect(res.body).toHaveProperty('message', `deleted car with id: ${car.id}`)

  // Verify it no longer exists in the DB
  const carInDb = await prisma.car.findUnique({ where: { id: car.id } })
  expect(carInDb).toBeNull()
})

test('GET /v1/location/:locationId/entrance/:entranceId/car/:id retrieves a single car', async () => {
  // Create a location, entrance, and a car
  const location = await prisma.location.create({ data: { name: 'Test Location - get single car' } })
  const entrance = await prisma.entrance.create({
    data: { name: 'Back Entrance', locationId: location.id },
  })
  const car = await prisma.car.create({
    data: { ticket: 'TICKET4', phoneNumber: '6666666666', entranceId: entrance.id, make: 'Chevy', color: 'White' },
  })

  const res = await request(app).get(`/v1/location/${location.id}/entrance/${entrance.id}/car/${car.id}`)

  expect(res.status).toBe(200)
  expect(res.body).toHaveProperty('message', `retrieved car with id: ${car.id}`)
  expect(res.body.car).toHaveProperty('ticket', 'TICKET4')
  expect(res.body.car).toHaveProperty('make', 'Chevy')
  expect(res.body.car).toHaveProperty('color', 'White')
})

test('POST /v1/location/:locationId/entrance/:entranceId/car creates a new car', async () => {
  const imagePath = path.join(__dirname, 'fixtures', 'kia-k4.jpg')
  // Create a location and entrance
  const location = await prisma.location.create({ data: { name: 'Test Location - create car' } })
  const entrance = await prisma.entrance.create({
    data: { name: 'Front Entrance', locationId: location.id },
  })

  const newCarData = {
    ticket: 'TICKET5',
    phoneNumber: '7777777777',
    make: 'Nissan',
    color: 'Green',
  }

  const res = await request(app)
    .post(`/v1/location/${location.id}/entrance/${entrance.id}/car`)
    .field('ticket', newCarData.ticket)
    .field('phoneNumber', newCarData.phoneNumber)
    .field('make', newCarData.make)
    .field('color', newCarData.color)
    .attach('images', imagePath)

  expect(res.status).toBe(201)
  expect(res.body).toHaveProperty('message', 'Car created successfully')
  expect(res.body.car).toHaveProperty('ticket', 'TICKET5')
  expect(res.body.car).toHaveProperty('make', 'Nissan')
  expect(res.body.car).toHaveProperty('color', 'Green')

  // Verify it exists in the DB
  const carInDb = await prisma.car.findUnique({ where: { ticket: 'TICKET5' } })
  expect(carInDb).not.toBeNull()
  expect(carInDb).toHaveProperty('id', carInDb?.id)
})
