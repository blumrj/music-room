const prisma = require('./db')

const SESSION_COOKIE = 'session_id'
const SESSION_TTL_MS = 7 * 24 * 60 * 60 * 1000 // 7 days

async function createSession(userId) {
  const session = await prisma.session.create({
    data: { userId, expiresAt: new Date(Date.now() + SESSION_TTL_MS) },
  })
  return session.id
}

async function getSessionUser(sessionId) {
  if (!sessionId) return null
  const session = await prisma.session.findUnique({
    where: { id: sessionId },
    include: { user: true },
  })
  if (!session) return null
  if (session.expiresAt < new Date()) {
    await prisma.session.delete({ where: { id: session.id } }).catch(() => {})
    return null
  }
  return session.user
}

function setSessionCookie(res, sessionId) {
  res.cookie(SESSION_COOKIE, sessionId, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    maxAge: SESSION_TTL_MS,
  })
}

function clearSessionCookie(res) {
  res.clearCookie(SESSION_COOKIE)
}

async function requireAuth(req, res, next) {
  const user = await getSessionUser(req.cookies?.[SESSION_COOKIE])
  if (!user) return res.status(401).json({ error: 'Not authenticated' })
  req.user = user
  next()
}

module.exports = {
  SESSION_COOKIE,
  createSession,
  getSessionUser,
  setSessionCookie,
  clearSessionCookie,
  requireAuth,
}
