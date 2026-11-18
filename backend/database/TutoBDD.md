# Tutoriel base de données — Prisma / SQLite

Ce tutoriel explique comment installer, lancer et utiliser la base de données
du projet SeenFlix depuis le dossier `backend/database`.

## 1. Prérequis

- Node.js 22.18 ou une version supérieure
- npm
- Git

## 2. Installation après récupération du dépôt

Depuis la racine du projet, ouvrez un terminal PowerShell :

```powershell
cd backend\database
npm install
```

Cette commande installe Prisma, Prisma Client, l’adaptateur SQLite,
`better-sqlite3`, `dotenv` et `bcrypt`.

## 3. Configuration de l’environnement

Vérifiez que `backend/database/.env` existe et contient :

```dotenv
DATABASE_URL="file:./dev.db"
```

Ce fichier est ignoré par Git. Chaque développeur doit donc le créer
localement dans `backend/database`.

## 4. Créer ou mettre à jour la base SQLite

Depuis `backend/database`, exécutez :

```powershell
npx prisma generate
npx prisma migrate deploy
```

- `npx prisma generate` génère le client JavaScript utilisé par les fonctions du projet.
- `npx prisma migrate deploy` applique les migrations présentes dans `prisma/migrations`
  et crée `dev.db` si nécessaire.

Pour ouvrir l’interface Prisma Studio :

```powershell
npx prisma studio
```

## 5. Tester la base

Depuis `backend/database` :

```powershell
npm run test:db
```

Le script `scripts/test-db.mjs` vérifie la fonction `createUser` :

- création d’un utilisateur test ;
- vérification de son enregistrement ;
- vérification du hachage du mot de passe ;
- refus d’un deuxième compte avec la même adresse e-mail ;
- suppression de l’utilisateur test.

## 6. Utiliser les fonctions de la base

Le fichier `backend/database/database.js` centralise les fonctions permettant
d’interagir avec Prisma et SQLite.

Exemple de script JavaScript :

```js
import {
    createUser,
    login,
    createFavorite,
} from './database.js'

const userId = await createUser(
    'utilisateur@example.com',
    'MotDePasse123!'
)

if (userId === false) {
    console.log('Cette adresse email est déjà utilisée')
} else {
    console.log("Utilisateur créé avec l’identifiant :", userId)
}

const connexion = await login(
    'utilisateur@example.com',
    'MotDePasse123!'
)

console.log(connexion)

const favori = await createFavorite(
    userId,
    550,
    'movie',
    5,
    'Très bon film'
)

console.log(favori)
```

## 7. Créer un utilisateur

```js
createUser(email, password)
```

- `email` : adresse e-mail de l’utilisateur ;
- `password` : mot de passe en clair saisi par l’utilisateur ;
- retourne l’identifiant de l’utilisateur ;
- retourne `false` si l’adresse e-mail existe déjà.

Le mot de passe est automatiquement transformé en hash avec `bcrypt`
avant son insertion dans la base.

## 8. Connecter un utilisateur

```js
login(email, password)
```

- `email` : adresse e-mail saisie ;
- `password` : mot de passe saisi ;
- retourne un objet avec la structure suivante :

```js
{
    success: true, // ou false
    msg: 'Message correspondant au résultat'
}
```

## 9. Créer un favori

```js
createFavorite(userId, tmdbId, type, rating, comment)
```

- `userId` : identifiant de l’utilisateur ;
- `tmdbId` : identifiant du film ou de la série ;
- `type` : type de l’œuvre, par exemple `"movie"` ou `"tv"` ;
- `rating` : note numérique ;
- `comment` : commentaire de l’utilisateur ;
- retourne le favori créé par Prisma.

## 10. Points importants

- Exécutez toujours les commandes depuis `backend/database`.
- Ne modifiez pas `dev.db` directement avec les fonctions du projet.
- N’enregistrez jamais le mot de passe en clair dans la base.
- N’ajoutez pas `.env` ou `node_modules` à Git.
- Après toute modification de `prisma/schema.prisma`, exécutez :

```powershell
npx prisma generate
npx prisma migrate dev --name nom_de_la_migration
```