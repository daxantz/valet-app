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

test('GET /v1/location retrieves all locations', async () => {
  // Create some locations to retrieve
  await prisma.location.createMany({
    data: [{ name: 'Location 1' }, { name: 'Location 2' }],
  })

  const res = await request(app).get('/v1/location')

  expect(res.status).toBe(200)
  expect(res.body).toHaveProperty('locations')
  expect(Array.isArray(res.body.locations)).toBe(true)
  expect(res.body.locations.length).toBeGreaterThanOrEqual(2) // At least the two we just created
})

test('GET /v1/location/:id retrieves a single location', async () => {
  // First, create a location to retrieve
  const newLocation = await prisma.location.create({ data: { name: 'Single Location' } })

  const res = await request(app).get(`/v1/location/${newLocation.id}`)

  expect(res.status).toBe(200)
  expect(res.body).toHaveProperty('location')
  expect(res.body.location).toHaveProperty('id', newLocation.id)
  expect(res.body.location).toHaveProperty('name', 'Single Location')
})
