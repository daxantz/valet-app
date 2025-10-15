import request from 'supertest'
import app from '../src/app'
import prisma from '../src/services/prisma'
import jwt from 'jsonwebtoken'
import authenticate from '../src/middlewares/authenicated'

import { Request, Response, NextFunction } from 'express'

beforeEach(async () => {
  await prisma.carImage.deleteMany()
  await prisma.car.deleteMany()
  await prisma.entrance.deleteMany()
  await prisma.employee.deleteMany()
  await prisma.location.deleteMany()
})

test('Login with valid credentials', async () => {
  // First, create a test location and employee in the database
  const location = await prisma.location.create({ data: { name: 'Test Location' } })
  const employee = await prisma.employee.create({
    data: { name: 'Test Employee', pin: '1234', locationId: location.id },
  })

  const token = jwt.sign({ locationId: location.id }, process.env.JWT_SECRET!)

  const res = await request(app)
    .post(`/v1/location/${location.id}/auth/login`)
    .set('Authorization', `Bearer ${token}`)
    .send({ pin: '1234' })

  expect(res.status).toBe(200)
  expect(res.body).toHaveProperty('message', 'Login successful')
  expect(res.body).toHaveProperty('employee')
  expect(res.body.employee).toHaveProperty('id', employee.id)
  expect(res.body.employee).toHaveProperty('name', 'Test Employee')
  expect(res.headers['set-cookie']).toBeDefined()

  // Clean up
  // await prisma.employee.delete({ where: { id: employee.id } })
  // await prisma.location.delete({ where: { id: location.id } })
})

test('Login with invalid PIN', async () => {
  // First, create a test location and employee in the database
  const location = await prisma.location.create({ data: { name: 'Test Location' } })
  await prisma.employee.create({
    data: { name: 'Test Employee', pin: '1234', locationId: location.id },
  })
  const token = jwt.sign({ locationId: location.id }, process.env.JWT_SECRET!)
  const res = await request(app)
    .post(`/v1/location/${location.id}/auth/login`)
    .set('Authorization', `Bearer ${token}`)
    .send({ pin: 'wrongpin' })

  expect(res.status).toBe(401)
  expect(res.body).toHaveProperty('error', 'Invalid PIN or location')

  // Clean up
  await prisma.employee.deleteMany({ where: { locationId: location.id } })
  await prisma.location.delete({ where: { id: location.id } })
})

describe('Auth Middleware', () => {
  it('calls next() when token is valid', () => {
    const token = jwt.sign({ employeeId: 1 }, process.env.JWT_SECRET)
    const req = {
      headers: { authorization: `Bearer ${token}` },
    } as Partial<Request>
    const res: Partial<Response> = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    }
    const next = jest.fn() as NextFunction

    authenticate(req as Request, res as Response, next)
    expect(next).toHaveBeenCalled()
  })

  it('returns 401 when token is missing', () => {
    const req = { cookies: {} } as Partial<Request>
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as Partial<Response>
    const next = jest.fn() as NextFunction

    authenticate(req as Request, res as Response, next)
    expect(res.status).toHaveBeenCalledWith(401)
    expect(res.json).toHaveBeenCalledWith({ error: 'Invalid or expired token' })
    expect(next).not.toHaveBeenCalled()
  })

  it('returns 401 when token is invalid', () => {
    const req = { cookies: { token: 'invalidtoken' } } as Partial<Request>
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as Partial<Response>
    const next = jest.fn() as NextFunction

    authenticate(req as Request, res as Response, next)
    expect(res.status).toHaveBeenCalledWith(401)
    expect(res.json).toHaveBeenCalledWith({ error: 'Invalid or expired token' })
    expect(next).not.toHaveBeenCalled()
  })
})
