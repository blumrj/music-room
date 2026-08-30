const RESEND_API_KEY = process.env.RESEND_API_KEY
const EMAIL_FROM = process.env.EMAIL_FROM || 'onboarding@resend.dev'

// Without a key, log instead of sending — lets the whole subscribe →
// confirm → notify flow be built and verified before a real Resend
// account (and eventually a verified domain) exists.
async function sendEmail({ to, subject, html }) {
  if (!RESEND_API_KEY) {
    console.log(`[email:dev-mode] would send "${subject}" to ${to}`)
    console.log(html)
    return { devMode: true }
  }

  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${RESEND_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ from: EMAIL_FROM, to, subject, html }),
  })

  if (!res.ok) {
    throw new Error(`Email send failed: ${res.status} ${await res.text()}`)
  }

  return res.json()
}

module.exports = { sendEmail }
