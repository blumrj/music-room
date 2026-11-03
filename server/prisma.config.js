import 'dotenv/config'
import { defineConfig } from 'prisma/config'

export default defineConfig({
  schema: 'prisma/schema.prisma',
  migrations: {
    path: 'prisma/migrations',
  },
  // Migrations need a direct connection; Neon's pooled URL (DATABASE_URL)
  // is for the app itself. Falls back for local/Docker Postgres.
  datasource: {
    url: process.env.DATABASE_URL_UNPOOLED || process.env.DATABASE_URL,
  },
})
