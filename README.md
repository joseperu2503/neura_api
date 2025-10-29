<p align="center">
<img src="assets/icons/icon.png" width="150"  alt="logo">
</p>

# Neura API

## Installation

### Environments

```bash
cp .env.example .env.dev
cp .env.example .env.prod
cp .env.example .env.staging
```

```bash
nano .env.dev
nano .env.prod
nano .env.staging
```

## Start all services in development mode with Docker:

```bash
docker compose -f docker-compose.dev.yml --env-file .env.dev -p neura_api_dev up --build
```

## Run the API in detached, production-ready mode:

```bash
docker compose -f docker-compose.prod.yml --env-file .env.prod -p neura_api_prod up -d --build

docker compose -f docker-compose.prod.yml --env-file .env.app -p neura_api_app up -d --build
```


Seed the database inside the container:

```bash
npm run cli -- seed
npm run cli:prod -- seed
```