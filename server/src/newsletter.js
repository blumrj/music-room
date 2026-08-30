const prisma = require('./db')
const { sendEmail } = require('./email')

const APP_BASE_URL = process.env.APP_BASE_URL || 'http://localhost:8888'

async function subscribe(email) {
  let subscriber = await prisma.subscriber.findUnique({ where: { email } })
  if (!subscriber) {
    subscriber = await prisma.subscriber.create({ data: { email } })
  }
  if (subscriber.confirmedAt) return subscriber

  const confirmUrl = `${APP_BASE_URL}/api/newsletter/confirm/${subscriber.token}`
  await sendEmail({
    to: subscriber.email,
    subject: 'Confirm your Music Room subscription',
    html: `<p>One more step — click to confirm you want crate updates:</p><p><a href="${confirmUrl}">${confirmUrl}</a></p>`,
  })
  return subscriber
}

async function confirmSubscriber(token) {
  const subscriber = await prisma.subscriber.findUnique({ where: { token } })
  if (!subscriber) return null
  return prisma.subscriber.update({
    where: { id: subscriber.id },
    data: { confirmedAt: new Date() },
  })
}

async function unsubscribe(token) {
  await prisma.subscriber.deleteMany({ where: { token } })
}

// Fired only when a track is genuinely added (not on remove/reorder, and
// not when adding just refreshes an already-in-the-crate track).
async function notifyTrackAdded(track) {
  const subscribers = await prisma.subscriber.findMany({
    where: { confirmedAt: { not: null } },
  })
  if (subscribers.length === 0) return

  const crate = await prisma.track.findMany({ orderBy: { position: 'asc' } })
  const crateListHtml = crate
    .map((t) => `<li>${t.title} — ${t.artist}${t.note ? ` (“${t.note}”)` : ''}</li>`)
    .join('')

  await Promise.all(
    subscribers.map((sub) => {
      const unsubscribeUrl = `${APP_BASE_URL}/api/newsletter/unsubscribe/${sub.token}`
      return sendEmail({
        to: sub.email,
        subject: `New in the crate: ${track.title}`,
        html: `
          <p>Just added <strong>${track.title}</strong> by ${track.artist} to the crate.</p>
          <p>The crate right now:</p>
          <ul>${crateListHtml}</ul>
          <p><a href="${unsubscribeUrl}">Unsubscribe</a></p>
        `,
      }).catch((err) => console.error('Failed to notify', sub.email, err))
    }),
  )
}

module.exports = { subscribe, confirmSubscriber, unsubscribe, notifyTrackAdded }
