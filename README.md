# CryDonkey (crydonkey)

## Install the dependencies
```bash
yarn install
```

### Start the app in development mode
```bash
docker compose -f docker-compose.dev.yml --env-file .env.dev up --build
```


### Build the app for production
```bash
docker compose -f docker-compose.yml --env-file .env.production up --build
```
