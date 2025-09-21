import request from 'supertest'
import app from '../src/app'
import prisma from '../src/services/prisma'
describe('Health Check', () => {
  it('GET /health should return 200 and {status: "ok"}', async () => {
    const res = await request(app).get('/health')
    expect(res.status).toBe(200)
    expect(res.body).toEqual({ status: 'ok' })
  })
})

describe('User routes', () => {
  beforeEach(async () => {
    await prisma.test.deleteMany() // clean table before each test
  })

  it('creates a new test record', async () => {
    const res = await prisma.test.create({
      data: { name: 'Sample', value: 42 },
    })
    expect(res.name).toBe('Sample')
  })
})
