import { PrismaClient } from '@prisma/client'
import dotenv from 'dotenv'

// Load the test environment variables
dotenv.config({ path: '.env.test' })
const prisma = new PrismaClient()

beforeAll(async () => {
  await prisma.$connect()
})

afterAll(async () => {
  await prisma.$disconnect()
})
