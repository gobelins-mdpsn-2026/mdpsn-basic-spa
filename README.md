# basic-spa — todo list en Express + React

La même todo list que `basic-ssr`, découpée en deux :

- `server/` : une API JSON en [Express](https://expressjs.com). Elle ne rend
  jamais de HTML, elle répond à `/api/todos`.
- `client/` : une application [React](https://react.dev) construite avec
  [Vite](https://vite.dev). Le navigateur la charge une fois, puis elle appelle
  l'API en `fetch` et redessine ce qui change. La page ne se recharge jamais.

Données dans PostgreSQL.

## Lire le code

- `server/todos.js` : les routes de l'API.
- `client/src/App.jsx` : l'état et les actions. Il distribue tout aux
  composants `TodoForm`, `Filters`, `TodoList` → `TodoItem`, `Footer`.
- `client/src/api.js` : les appels HTTP, un par action.

Ouvrez l'onglet Réseau en cliquant dans l'app : des requêtes `fetch` vers
`/api/…` qui renvoient du JSON, et aucun rechargement de page.

## Lancer en local

```sh
npm install
cp .env.example .env
docker compose up -d db          # une base PostgreSQL locale
DATABASE_URL=$(grep DATABASE_URL .env | cut -d= -f2-) npm run dev
```

Puis <http://localhost:5173> (Vite, avec rechargement à chaud). Vite
transmet `/api` à Express sur le port 3000.

Tests (la base doit tourner) :

```sh
DATABASE_URL=postgres://todo:todo@localhost:5432/todo npm test
```

## Lancer tout avec Docker

```sh
docker compose up --build
```

Puis <http://localhost:3000>. En production, Express sert aussi le build de
React (`client/dist`), il n'y a qu'un seul serveur.

## Déployer sur Coolify

New Resource → Application → ce dépôt, branche `main`, build pack
**Docker Compose**. Coolify lit `docker-compose.yml`, crée l'app et sa base.
Donnez un domaine au service `app`, déployez. Aucune variable à renseigner.

## Attention

Aucune authentification : tout le monde voit et modifie la même liste.

## Licence

MIT.
