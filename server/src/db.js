const { PrismaClient } = require('@prisma/client')
const { PrismaPg } = require('@prisma/adapter-pg')

// Reused across requests (and across Lambda/Function invocations that
// reuse the same warm container) rather than opening a new client per
// request — avoids exhausting Postgres connections under load.
function createClient() {
  const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL })
  return new PrismaClient({ adapter })
}

const prisma = global.__prisma ?? createClient()
if (process.env.NODE_ENV !== 'production') {
  global.__prisma = prisma
}

module.exports = prisma
