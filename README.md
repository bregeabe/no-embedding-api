# no-embedding-api
API for noembedding.com

## Setup MySQL server

Use this docker command in your terminal

```bash
docker run -d -p 0.0.0.0:3306:3306 --name="noembedding" -e MYSQL_ROOT_PASSWORD=password -e MYSQL_DATABASE=noembedding -d mysql:8
```

## Installation

1. Install dependencies:
```bash
npm install
```

2. Set up the database schema and seed data, then start the server:
```bash
npm run rebuild_run
```

## Available Scripts

- `npm start` - Start the server
- `npm run dev` - Start the server in development mode with auto-reload
- `npm run rebuild_run` - Rebuild schema, insert seed data, and start server
- `npm run rebuild:schema` - Only rebuild database schema
- `npm run rebuild:seed` - Only insert seed data

## API Endpoints

### Health Check
- `GET /api/health` - Check if API is running

### Languages
- `GET /api/languages` - Get all languages
- `GET /api/languages/:id` - Get language by ID
- `POST /api/languages` - Create new language
- `PUT /api/languages/:id` - Update language
- `DELETE /api/languages/:id` - Delete language

### Institutions  
- `GET /api/institutions` - Get all institutions
- `GET /api/institutions/:id` - Get institution by ID
- `POST /api/institutions` - Create new institution
- `PUT /api/institutions/:id` - Update institution
- `DELETE /api/institutions/:id` - Delete institution

### Literature
- `GET /api/literature` - Get all literature
- `GET /api/literature/:id` - Get literature by ID
- `POST /api/literature` - Create new literature  
- `PUT /api/literature/:id` - Update literature
- `DELETE /api/literature/:id` - Delete literature

## Environment Variables

The following environment variables are configured in `.env`:

- `PORT` - Server port (default: 8080)
- `DB_HOST` - MySQL host
- `DB_PORT` - MySQL port  
- `DB_USER` - MySQL username
- `DB_PASSWORD` - MySQL password
- `DB_SCHEMA` - Database name
- `CORS_ORIGIN` - Allowed CORS origins
- `JWT_SECRET` - JWT secret key
- `NODE_ENV` - Environment mode