import sessionService from '../services/session.service.js'

async function login(req, res) {
  const { email, password } = req.body
  try {
    const { sessionId, email: userEmail } = await sessionService.login(email, password)
    sessionService.setSessionCookie(res, sessionId)
    res.json({ email: userEmail })
  } catch (err) {
    res.status(err.status ?? 500).json({ error: err.message })
  }
}

async function logout(req, res) {
  const sessionId = req.cookies?.[sessionService.SESSION_COOKIE]
  if (sessionId) await sessionService.logout(sessionId)
  sessionService.clearSessionCookie(res)
  res.json({ ok: true })
}

async function me(req, res) {
  const user = await sessionService.getSessionUser(req.cookies?.[sessionService.SESSION_COOKIE])
  res.json({ authenticated: Boolean(user), email: user?.email ?? null })
}

export default { login, logout, me }
