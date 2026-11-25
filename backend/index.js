import express from 'express';
import faker from 'faker';
import cors from 'cors';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';

// config des variables d'environnement
dotenv.config({ path: '../.env'});
// Initialisation serveur
const app = express();
const authRouter = express.Router();
const moviesRouter = express.Router();
app.use(express.json());
// config port d'écoute
const PORT = process.env.PORT;
// Sécurité
app.use(cors());
// Configuration parser body
app.use(bodyParser.json());
// Configuration Faker
faker.locale = 'fr';
// cache en RAM
const cache = new Map();
const TTL = 10 * 60 * 1000; // 10m * 60s * 1000ms
// création de la route /auth et /movies
app.use('/auth', authRouter);
app.use('/movies', moviesRouter);

authRouter.post('/register', (req, res) => {
    const {email, password} = req.body ?? {};
    if (typeof email !== 'string' || typeof password !== 'string' || !email.trim() || !password) {
        return res.status(400).json({error: "email and password required"});
    }
    res.send('/register - email and password OK for bdd');
    // appel fonction bdd -> si je reçois false, c'est que l'email existe déjà
});

authRouter.post('/login', (req, res) => {
    const {email, password} = req.body ?? {};
    if (typeof email !== 'string' || typeof password !== 'string' || !email.trim() || !password) {
        return res.status(400).json({error: "email and password required"});
    }
    res.send('/login - email and password OK for bdd check');
    // appel bdd pour vérifier la validité des credentials
});

authRouter.post('/refresh', (req, res) => {
    res.send('token refresh route');
});

moviesRouter.get('/search', async (req, res) => {
    const start = performance.now();
    try {
        const {q} = req.query;
        if (typeof q !== 'string' || !q.trim()) {
            return res.status(400).json({ error: 'Paramètre q requis'});
        }
        const key = q.trim().toLowerCase();
        const hit = cache.get(key);
        if (hit && (Date.now() - hit.time) < TTL) {
            console.log(`Temps de réponse avec cache : ${performance.now() - start} ms`);
            return res.json(hit.data);
        }
        const params = new URLSearchParams({ query: q.trim(), language: 'fr-FR' });
        const TMDBres = await fetch(`https://api.themoviedb.org/3/search/movie?${params}`, {
            headers: {Authorization: `Bearer ${process.env.API_READ_ACCESS_TOKEN}`}
        });

        if (!TMDBres.ok) return res.status(502).json({error: `TMDB a répondu ${TMDBres.status}`});
        const data = await TMDBres.json();
        const movies = data.results.map(toMovie);
        if (cache.size >= 500) cache.delete(cache.keys().next().value); // supprime la plus ancienne
        cache.delete(key);
        cache.set(key, {data: movies, time: Date.now()});
        console.log(`Temps de réponse sans cache : ${performance.now() - start} ms`);
        res.json(movies);
    } catch (err) {
        console.error(err);
        res.status(500).json({error: 'Erreur lors de la recherche de film'});
    }
});

const IMG_BASE = 'https://image.tmdb.org/t/p/w500';
const toMovie = (m) => ({
    id: m.id,
    title: m.title,
    overview: m.overview,
    releaseDate: m.release_date,
    rating: m.vote_average,
    poster: m.poster_path ? IMG_BASE + m.poster_path : null,
});


app.listen(PORT, () => {
    console.log(`Serveur démarré sur http://localhost:${PORT}`);
});
