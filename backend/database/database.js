import 'dotenv/config'
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3'
import { PrismaClient } from './generated/prisma/client.ts'
import bcrypt from 'bcrypt'

//region Client BDD

// PATH vers la base de données SQLite
const databaseUrl = process.env.DATABASE_URL
// Initialisation de l'adaptateur SQLite pour Prisma avec l'URL de la base de données
const adapter = new PrismaBetterSqlite3({ url: databaseUrl.replace('file:', '') })
// Client Prisma pour interagir avec la base de données
const prisma = new PrismaClient({ adapter })

//endregion

//region Fonctions BDD

/**
 * Crée un nouvel utilisateur en base
 * @param email
 * @param password
 * @returns {Promise<*>}
 */
export async function createUser(email, password) {
    const userExists = await prisma.user.findUnique({ where: { email } });
    if (userExists) {
        return false;
    }
    const passwordHash = await hashPassword(password);
    const user = await prisma.user.create({
        data: {
            email,
            passwordHash,
        },
    });
    return user.id;
}

/**
 * Vérifie les informations de connexion d'un utilisateur
 * @param email
 * @param password
 * @param msg
 * @returns {Promise<{success: boolean, msg: string}>} success: true si la connexion est réussie, false sinon. msg contient un message d'erreur ou de succès.
 */
export async function login(email, password, msg) {
    const user = await prisma.user.findUnique({ where: { email } });

    if(!user)
        return {
            success: false,
            msg: 'Cette adresse email ne correspond à aucun compte',
        };

    const isMatch = await comparePassword(password, user.passwordHash);

    if (!isMatch) {
        return {
            success: false,
            msg: 'Mot de passe incorrect',
        }
    }

    return {
        success: true,
        msg: 'Connexion réussie',
    }
}

/**
 * Crée un favori pour un utilisateur
 * @param userId
 * @param tmdbId
 * @param type
 * @param rating
 * @param comment
 * @returns {Promise<*>}
 */
export async function  createFavorite(userId, tmdbId, type, rating, comment) {
    return prisma.favorite.create({
        data: {
            userId,
            tmdbId,
            type,
            rating,
            comment
        },
    })
}

//endregion

//region Fonction Bcrypt

/**
 * Hash un mot de passe avec bcrypt
 * @param password
 * @returns {Promise<void|*>} le hash du mot de passe
 */
async function hashPassword(password) {
    return bcrypt.hash(password, 10); // le salt est généré automatiquement et stocké dans le hash
}

/**
 * Compare un mot de passe avec son hash
 * @param password
 * @param passwordHash
 * @returns {Promise<void|*>} true si le mot de passe correspond au hash, false sinon
 */
async function comparePassword(password, passwordHash) {
    return bcrypt.compare(password, passwordHash);
}

//endregion