# Fastify + TypeScript Starter

A minimal, production-ready starter for building REST APIs with Fastify and TypeScript.

## Features
- Fastify v4, TypeScript strict mode
- JWT auth with `@fastify/jwt`
- Swagger (OpenAPI) docs at `/docs`
- Health check (`/health`), auth (`/auth/login`), and a protected route (`/users/me`)
- CORS & sensible defaults
- Ready for Docker

## Getting Started

```bash
# 1) Install deps
npm install

# 2) Configure env
cp .env.example .env
# edit JWT_SECRET

# 3) Run in dev
npm run dev
# Visit http://localhost:3000/docs
```

## Production

```bash
npm run build
npm start
```

## Docker

```bash
docker build -t fastify-ts-starter .
docker run --env-file .env -p 3000:3000 fastify-ts-starter
```

Or with docker-compose:

```bash
docker compose up --build
```

## Endpoints

- `GET /health` — liveness probe
- `POST /auth/login` — returns a JWT; body: `{ "email": "test@example.com", "password": "secret" }`
- `GET /users/me` — protected; add header: `Authorization: Bearer <token>`

## Notes

- This starter keeps auth simple (mock user validation). Replace with real DB/user store.
- The JWT embeds `sub` (user id) and `email`; rotate `JWT_SECRET` regularly.
