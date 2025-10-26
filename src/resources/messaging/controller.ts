import { NextFunction, Request, Response } from 'express'
import sendSms from '../../services/sendSms'
import { getLocationById } from '../../services/locationService'
const virtualNumber = process.env.TWILIO_VIRTUAL_NUMBER || ''
const sendWelcomeMessage = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { ticketNumber } = req.body
    const { locationId } = req.params
    console.log('Location ID:', locationId)
    const location = await getLocationById(parseInt(locationId))
    if (!location) {
      return res.status(404).json({ error: 'Location not found' })
    }
    // if (!phoneNumber) {
    //   return res.status(400).json({ error: 'Phone number is required' })
    // }
    if (!ticketNumber) {
      return res.status(400).json({ error: 'Ticket number is required' })
    }

    const message = `Welcome to ${location.name}! Your your ticket number is ${ticketNumber}.`
    //send sms to virtual phone number in development, get real phone number from req.params in production
    const result = sendSms(virtualNumber, message)
    return res.status(200).json({ message: 'Welcome message sent successfully', result })
  } catch (error) {
    console.error('Error sending welcome message:', error)
    next(error)
  }
}

export { sendWelcomeMessage }
