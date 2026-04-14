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