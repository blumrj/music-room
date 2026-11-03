import 'dotenv/config'
import bcrypt from 'bcryptjs'
import prisma from '../src/db.js'

async function main() {
  const email = process.env.ADMIN_EMAIL || 'admin@music-room.local'
  const password = process.env.ADMIN_PASSWORD || 'change-me'

  const existing = await prisma.user.findUnique({ where: { email } })
  if (existing) {
    console.log(`Admin user already exists: ${email}`)
    return
  }

  const passwordHash = await bcrypt.hash(password, 10)
  const user = await prisma.user.create({ data: { email, passwordHash } })
  console.log(`Created admin user: ${user.email}`)
}

main()
  .catch((err) => {
    console.error(err)
    process.exitCode = 1
  })
  .finally(() => prisma.$disconnect())
