import sessionService from '../services/session.service.js'

async function requireAuth(req, res, next) {
  const user = await sessionService.getSessionUser(req.cookies?.[sessionService.SESSION_COOKIE])
  if (!user) return res.status(401).json({ error: 'Not authenticated' })
  req.user = user
  next()
}

export default requireAuth