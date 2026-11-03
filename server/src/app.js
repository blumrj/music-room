import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import prisma from './db.js'
import asyncHandler from './middleware/asyncHandler.js'
import errorHandler from './middleware/errorHandler.js'
import tracksRoutes from './routes/tracks.routes.js'
import deezerRoutes from './routes/deezer.routes.js'
import authRoutes from './routes/auth.routes.js'

const app = express()

app.use(cors())
app.use(express.json())
app.use(cookieParser())

app.get('/api/health', asyncHandler(async (_req, res) => {
  await prisma.$queryRaw`SELECT 1`
  res.json({ ok: true })
}))

app.use('/api/tracks', tracksRoutes)
app.use('/api/deezer', deezerRoutes)
app.use('/api/auth', authRoutes)

app.use(errorHandler)

export default app
