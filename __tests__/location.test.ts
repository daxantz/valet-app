import request from 'supertest'
import app from '../src/app'
import prisma from '../src/services/prisma'

test('POST /v1/user creates a new location', async () => {
  const res = await request(app).post('/v1/location').send({ name: 'New Location' })

  expect(res.status).toBe(201)
  expect(res.body).toHaveProperty('message', 'Location created successfully: New Location')

  // Verify it exists in the DB
  const locationInDb = await prisma.location.findFirst({ where: { name: 'New Location' } })
  expect(locationInDb).not.toBeNull()
})
