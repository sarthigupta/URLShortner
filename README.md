# URL Shortener

A full-stack URL shortener with a React client, an Express API, PostgreSQL for durable storage, and Redis caching for fast lookups and redirects.

The app accepts a long URL, generates a short ID, stores the mapping, and redirects short URLs back to their original destination. Requests are routed through Nginx in the Docker setup.

## Architecture

The architecture in the diagram is close to the implementation, with one important detail: Redis is provided by Upstash rather than a local Redis container in this repo.

![Architecture Diagram](./images/architecture.png)

### Request flow

For shortening a URL:
1. The client submits a long URL to `POST /api/url/shorten`.
2. The API validates the input with Zod.
3. The API checks Redis for an existing mapping.
4. If Redis misses, it checks PostgreSQL for the long URL.
5. If the mapping does not exist, the API generates a new short ID, saves it to PostgreSQL, and writes both cache keys to Redis.

For redirecting a short URL:
1. The browser opens `GET /api/url/:shortURL`.
2. The API checks Redis for the long URL.
3. If Redis misses, it queries PostgreSQL.
4. If found, it stores the mapping in Redis and redirects the browser to the original URL.

## Tech Stack

### Frontend

- React 19
- Vite
- TypeScript
- Tailwind CSS
- Axios

### Backend

- Node.js
- Express 5
- Prisma ORM
- PostgreSQL
- Upstash Redis
- Zod
- express-rate-limit
- nanoid

### Infrastructure

- Docker and Docker Compose
- Nginx reverse proxy

## Features

- Shorten a valid long URL into an 8-character short ID.
- Redirect short URLs back to the original destination.
- Avoid duplicate short links for the same long URL by reusing stored mappings.
- Cache long/short mappings in Redis for faster repeated lookups.
- Apply rate limiting on API routes.
- Expose a health check endpoint for the server.

## Data Model

The Prisma schema currently defines a `URL` model with these fields:

- `id`
- `longURL`
- `shortURL`
- `clicks`
- `createdAt`
- `expiresAt`

The current controller uses `longURL` and `shortURL` for shortening and redirects. The remaining fields are available for analytics or expiry features later.

## API

### `GET /api/health`

Returns server health status.

Response:

```json
{ "status": "ok" }
```

### `POST /api/url/shorten`

Creates or reuses a short URL for a valid long URL.

Request body:

```json
{ "longURL": "https://example.com/some/long/path" }
```

Successful response:

```json
{
  "shortURL": "abc12345",
  "longURL": "https://example.com/some/long/path",
  "success": true
}
```

### `GET /api/url/:shortURL`

Redirects the browser to the original long URL.

## Local Development

### Prerequisites

- Node.js 22 or newer
- PostgreSQL
- Upstash Redis account or compatible Redis REST credentials

### Environment variables

Create a `server/.env` file with at least:

```env
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/url_db
UPSTASH_REDIS_REST_URL=your_redis_rest_url
UPSTASH_REDIS_REST_TOKEN=your_redis_rest_token
PORT=3000
```

### Run with Docker Compose

```bash
docker compose up --build
```

This starts:

- the React client on the internal Vite dev server
- the Express API on port `3000`
- PostgreSQL on port `5432`
- Nginx on port `8080`

Open `http://localhost:8080` in your browser.

### Run without Docker

Start the backend:

```bash
cd server
npm install
npm run build
npm start
```

Start the frontend:

```bash
cd client
npm install
npm run dev
```

## Notes

- The Docker Compose file currently starts a single server container, but the architecture is compatible with multiple API replicas behind Nginx.
- Redis is used as a cache layer, not the source of truth. PostgreSQL remains the durable store for URL mappings.
- The UI in the current client is intentionally minimal and focuses on shortening and redirecting flows.

## Project Structure

```text
client/   React app
server/   Express API, Prisma schema, Redis integration, and routes
nginx/    Reverse proxy configuration
```
