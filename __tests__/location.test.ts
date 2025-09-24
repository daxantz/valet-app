import request from 'supertest'
import app from '../src/app'
import prisma from '../src/services/prisma'

test('POST /v1/location creates a new location', async () => {
  const res = await request(app).post('/v1/location/create').send({ name: 'New Location' })

  expect(res.status).toBe(201)
  expect(res.body).toHaveProperty('message', 'Location created successfully: New Location')

  // Verify it exists in the DB
  const locationInDb = await prisma.location.findFirst({ where: { name: 'New Location' } })
  expect(locationInDb).not.toBeNull()
})

test('DELETE /v1/location/:id deletes a location', async () => {
  // First, create a location to delete
  const newLocation = await prisma.location.create({ data: { name: 'Location To Delete' } })

  const res = await request(app).delete(`/v1/location/${newLocation.id}`)

  expect(res.status).toBe(200)
  expect(res.body).toHaveProperty('message', `Location: ${newLocation.name} deleted successfully`)

  // Verify it no longer exists in the DB
  const locationInDb = await prisma.location.findUnique({ where: { id: newLocation.id } })
  expect(locationInDb).toBeNull()
})
