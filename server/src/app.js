const express = require('express')
const cors = require('cors')
const cookieParser = require('cookie-parser')
const bcrypt = require('bcryptjs')
const prisma = require('./db')
const deezer = require('./deezer')
const tracksService = require('./tracksService')
const newsletter = require('./newsletter')
const {
  createSession,
  getSessionUser,
  setSessionCookie,
  clearSessionCookie,
  requireAuth,
  SESSION_COOKIE,
} = require('./auth')

const app = express()

app.use(cors())
app.use(express.json())
app.use(cookieParser())

const wrap = (fn) => (req, res, next) => fn(req, res, next).catch(next)

app.get('/api/health', wrap(async (_req, res) => {
  await prisma.$queryRaw`SELECT 1`
  res.json({ ok: true })
}))

app.get('/api/tracks', wrap(async (_req, res) => {
  const tracks = await prisma.track.findMany({ orderBy: { position: 'asc' } })
  res.json(tracks)
}))

app.get('/api/deezer/search', wrap(async (req, res) => {
  const q = req.query.q
  if (!q) return res.status(400).json({ error: 'q is required' })
  const results = await deezer.searchTracks(q)
  res.json(results)
}))

app.post('/api/tracks', requireAuth, wrap(async (req, res) => {
  const { deezerId, note } = req.body
  if (!deezerId) return res.status(400).json({ error: 'deezerId is required' })
  const track = await tracksService.addTrackFromDeezer({ deezerId, note })
  res.status(201).json(track)
}))

app.delete('/api/tracks/:id', requireAuth, wrap(async (req, res) => {
  await tracksService.removeTrack(req.params.id)
  res.status(204).end()
}))

app.put('/api/tracks/order', requireAuth, wrap(async (req, res) => {
  const { orderedIds } = req.body
  if (!Array.isArray(orderedIds) || orderedIds.length === 0) {
    return res.status(400).json({ error: 'orderedIds must be a non-empty array' })
  }
  await tracksService.reorderTracks(orderedIds)
  res.json({ ok: true })
}))

app.post('/api/tracks/refresh', wrap(async (_req, res) => {
  const refreshed = await tracksService.refreshStaleTracks()
  res.json({ refreshed })
}))

// Deezer preview URLs are short-lived signed links (~15 minutes, verified
// against the real API) — nowhere near the metadata's own staleness
// window, so previewUrl can never be served from the daily-refreshed
// snapshot. This always re-fetches from Deezer at the moment it's asked
// for, which is what Phase 5 playback calls right before a preview plays.
app.get('/api/tracks/:id/preview-url', wrap(async (req, res) => {
  const track = await prisma.track.findUnique({ where: { id: req.params.id } })
  if (!track) return res.status(404).json({ error: 'Track not found' })
  const fresh = await deezer.getTrack(track.externalId)
  await prisma.track.update({
    where: { id: track.id },
    data: { previewUrl: fresh.previewUrl, lastFetchedAt: new Date() },
  })
  res.json({ previewUrl: fresh.previewUrl })
}))

app.post('/api/auth/login', wrap(async (req, res) => {
  const { email, password } = req.body
  const user = email && (await prisma.user.findUnique({ where: { email } }))
  const valid = user && (await bcrypt.compare(password ?? '', user.passwordHash))
  if (!valid) return res.status(401).json({ error: 'Invalid email or password' })

  const sessionId = await createSession(user.id)
  setSessionCookie(res, sessionId)
  res.json({ email: user.email })
}))

app.post('/api/auth/logout', wrap(async (req, res) => {
  const sessionId = req.cookies?.[SESSION_COOKIE]
  if (sessionId) await prisma.session.delete({ where: { id: sessionId } }).catch(() => {})
  clearSessionCookie(res)
  res.json({ ok: true })
}))

app.get('/api/auth/me', wrap(async (req, res) => {
  const user = await getSessionUser(req.cookies?.[SESSION_COOKIE])
  res.json({ authenticated: Boolean(user), email: user?.email ?? null })
}))

app.post('/api/newsletter/subscribe', wrap(async (req, res) => {
  const { email } = req.body
  if (!email) return res.status(400).json({ error: 'email is required' })
  await newsletter.subscribe(email)
  res.json({ ok: true })
}))

app.get('/api/newsletter/confirm/:token', wrap(async (req, res) => {
  const subscriber = await newsletter.confirmSubscriber(req.params.token)
  if (!subscriber) return res.status(404).send('That confirmation link is invalid or expired.')
  res.send('Subscribed! You can close this tab.')
}))

app.get('/api/newsletter/unsubscribe/:token', wrap(async (req, res) => {
  await newsletter.unsubscribe(req.params.token)
  res.send('You have been unsubscribed.')
}))

app.use((err, _req, res, _next) => {
  console.error(err)
  res.status(500).json({ error: 'Internal server error' })
})

module.exports = app
