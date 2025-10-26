import request from 'supertest'
import app from '../src/app'
import prisma from '../src/services/prisma'

test('POST /v1/location/:id/messaging/send-welcome sends a welcome message', async () => {
  // First, create a location to use
  const newLocation = await prisma.location.create({ data: { name: 'Messaging Test Location' } })

  const res = await request(app)
    .post(`/v1/location/${newLocation.id}/messaging/send-welcome`)
    .send({ ticketNumber: '12345' })

  expect(res.status).toBe(200)
  expect(res.body).toHaveProperty('message', 'Welcome message sent successfully')
})
