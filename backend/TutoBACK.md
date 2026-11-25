# Lancer le backend en local

## Prérequis

- **Node.js 18 ou plus** (le serveur utilise `fetch` et `performance`, qui sont intégrés à Node à partir de la v18). Pour vérifier :
  ```bash
  node -v
  ```
- Un **token TMDB** (« API Read Access Token »), à récupérer sur https://www.themoviedb.org/settings/api

## 1. Récupérer les modifications

```bash
git pull
```

## 2. Installer les dépendances

Toutes les commandes npm se lancent **depuis le dossier `backend`** :

```bash
cd backend
npm install
```

À relancer à chaque fois que quelqu'un a modifié `package.json` ou `package-lock.json`.

## 3. Créer le fichier `.env`

Le fichier `.env` se trouve **à la racine du projet** (pas dans `backend`). Il n'est pas versionné : chacun crée le sien à partir de `.env.example`.

Depuis la racine du projet :

```bash
# Windows (cmd)
copy .env.example .env

# macOS / Linux / Git Bash
cp .env.example .env
```

Puis le remplir :

```env
API_READ_ACCESS_TOKEN=<ton token TMDB>
API_KEY=<ta clé API TMDB>
PORT=3000
```

> `PORT` est obligatoire : s'il est vide, le serveur démarre sur un port aléatoire.

## 4. Lancer le serveur

Toujours depuis `backend` (le `.env` est cherché dans `../.env` par rapport au dossier où tu lances la commande) :

```bash
# Mode développement : redémarre automatiquement à chaque modification (nodemon)
npm run dev

# Mode normal
npm start
```

Le terminal doit afficher :

```
Serveur démarré sur http://localhost:3000
```

Pour arrêter le serveur : `Ctrl + C`.

## 5. Tester les routes

| Méthode | Route             | Body / paramètres                      |
|---------|-------------------|----------------------------------------|
| POST    | `/auth/register`  | JSON `{ "email": "...", "password": "..." }` |
| POST    | `/auth/login`     | JSON `{ "email": "...", "password": "..." }` |
| POST    | `/auth/refresh`   | aucun                                  |
| GET     | `/movies/search`  | `?q=<titre du film>`                   |

Exemples avec `curl` :

```bash
curl "http://localhost:3000/movies/search?q=inception"

curl -X POST http://localhost:3000/auth/login -H "Content-Type: application/json" -d "{\"email\":\"test@test.fr\",\"password\":\"1234\"}"
```

## Problèmes fréquents

| Erreur | Solution |
|--------|----------|
| `Cannot find package 'dotenv'` (ou un autre package) | Relancer `npm install` dans `backend` |
| `TMDB a répondu 401` | Token absent ou invalide dans `.env` (`API_READ_ACCESS_TOKEN`) |
| Le serveur affiche `http://localhost:undefined` | `PORT` vide dans `.env`, ou commande lancée depuis un autre dossier que `backend` |
| `EADDRINUSE` | Le port est déjà utilisé : arrêter l'autre serveur ou changer `PORT` |
