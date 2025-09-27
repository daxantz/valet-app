import request from 'supertest'
import app from '../src/app'
import prisma from '../src/services/prisma'

beforeEach(async () => {
  await prisma.entrance.deleteMany()
  await prisma.location.deleteMany()
})

test('POST /v1/location/:locationId/entrance creates a new entrance', async () => {
  // First, create a location to associate with the entrance
  const location = await prisma.location.create({ data: { name: 'Test Location' } })

  const res = await request(app).post(`/v1/location/${location.id}/entrance`).send({ name: 'North West' })

  expect(res.status).toBe(201)
  expect(res.body).toHaveProperty('message', 'Entrance created successfully: North West')

  // Verify it exists in the DB
  const entranceInDb = await prisma.entrance.findFirst({ where: { name: 'North West' } })
  expect(entranceInDb).not.toBeNull()
  expect(entranceInDb?.locationId).toBe(location.id)
})

test('GET /v1/location/:locationId/entrance retrieves entrances by location', async () => {
  // Create a location and entrances
  const location = await prisma.location.create({ data: { name: 'Another Location' } })
  await prisma.entrance.createMany({
    data: [
      { name: 'East Gate', locationId: location.id },
      { name: 'West Gate', locationId: location.id },
    ],
  })

  const res = await request(app).get(`/v1/location/${location.id}/entrance`)

  expect(res.status).toBe(200)
  expect(res.body).toHaveProperty('entrances')
  expect(res.body.entrances.length).toBe(2)
  expect(res.body.entrances[0]).toHaveProperty('name')
  expect(res.body.entrances[0]).toHaveProperty('locationId', location.id)
})

test('DELETE /v1/location/:locationId/entrance/:id deletes an entrance', async () => {
  // Create a location and an entrance
  const location = await prisma.location.create({ data: { name: 'Delete Location' } })
  const entrance = await prisma.entrance.create({ data: { name: 'To Be Deleted', locationId: location.id } })

  const res = await request(app).delete(`/v1/location/${location.id}/entrance/${entrance.id}`)

  expect(res.status).toBe(200)
  expect(res.body).toHaveProperty('message', `Delete entrance:  ${entrance.id} `)

  // Verify it's deleted from the DB
  const entranceInDb = await prisma.entrance.findUnique({ where: { id: entrance.id } })
  expect(entranceInDb).toBeNull()
})
