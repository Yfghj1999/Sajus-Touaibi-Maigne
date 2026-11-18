import 'dotenv/config'
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3'
import { PrismaClient } from '../generated/prisma/client.ts'
import { createUser } from '../database.js'

const databaseUrl = process.env.DATABASE_URL

if (!databaseUrl || !databaseUrl.startsWith('file:')) {
  throw new Error('DATABASE_URL must contain a SQLite file URL, for example file:./dev.db')
}

const adapter = new PrismaBetterSqlite3({ url: databaseUrl.slice('file:'.length) })
const prisma = new PrismaClient({ adapter })

try {
  await prisma.$connect()

  const email = `test-${Date.now()}@example.com`
  const password = 'MotDePasseTest123!'

  const createdId = await createUser(email, password)
  const createdUser = await prisma.user.findUnique({
    where: { email },
  })

  if (!createdId || !createdUser) {
    throw new Error("createUser n'a pas créé l'utilisateur")
  }

  if (createdUser.passwordHash === password) {
    throw new Error('Le mot de passe doit être enregistré sous forme de hash')
  }

  const duplicateResult = await createUser(email, password)
  if (duplicateResult !== false) {
    throw new Error('createUser aurait dû refuser un e-mail déjà existant')
  }

  console.log('Test createUser réussi.')
  console.table({
    id: createdUser.id,
    email: createdUser.email,
    passwordHashed: createdUser.passwordHash !== password,
    duplicateRejected: duplicateResult === false,
  })

  await prisma.user.delete({ where: { email } })
} catch (error) {
  console.error('Échec du test createUser :')
  console.error(error)
  process.exitCode = 1
} finally {
  await prisma.$disconnect()
}