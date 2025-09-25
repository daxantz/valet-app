import request from 'supertest'
import app from '../src/app'
import prisma from '../src/services/prisma'

test('POST /v1/entrance creates a new entrance', async () => {
  // First, create a location to associate with the entrance
  const location = await prisma.location.create({ data: { name: 'Test Location' } })

  const res = await request(app).post('/v1/entrance').send({ name: 'North West', locationId: location.id })

  expect(res.status).toBe(201)
  expect(res.body).toHaveProperty('message', 'Entrance created successfully: North West')

  // Verify it exists in the DB
  const entranceInDb = await prisma.entrance.findFirst({ where: { name: 'North West' } })
  expect(entranceInDb).not.toBeNull()
  expect(entranceInDb?.locationId).toBe(location.id)
})
