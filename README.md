<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>


# Ejecutar en desarrollo

1. Clonar el repositorio
2. Ejecutar
```
npm install
```

3. tener Nest CLI instalado
```
npm i -g @nestjs/cli
```

2. Levantar la base de datos
```
docker compose up -d 
```

## Desarrollo

```bash
docker compose -f docker-compose.dev.yml --env-file .env.dev -p neura_api_dev up --build
```

## Produccion

```bash
docker compose -f docker-compose.prod.yml --env-file .env.prod -p neura_api_prod up -d --build
```