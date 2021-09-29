# Events API 

This API allows you to handle bussiness logic about events creation (Like for example meetings, videocalls...)

This API uses some features:

- [morgan](https://www.npmjs.com/package/morgan)
  - HTTP request logger middleware for node.js
- [helmet](https://www.npmjs.com/package/helmet)
  - Helmet helps you secure your Express apps by setting various HTTP headers. It's not a silver bullet, but it can help!
- [dotenv](https://www.npmjs.com/package/dotenv)
  - Dotenv is a zero-dependency module that loads environment variables from a `.env` file into `process.env`

Development utilities:

- [ts-node-dev](https://www.npmjs.com/package/ts-node-dev)
  - ts-node-dev is a library that restarts target node process when any of required files changes (as standard node-dev) but shares Typescript compilation process between restarts.
- [eslint](https://www.npmjs.com/package/eslint)
- [typescript](https://www.npmjs.com/package/typescript)
- [docker](https://www.docker.com/)
- [socket.io](https://www.socket.io/)

## Setup

```
npm install
```

## Lint

```
npm run lint
```

## Development

```
npm run dev
```

## For docker deployment

* Need for docker-compose and docker to be installed in your machine.
  
```
docker-compose build
```

```
docker-compose up
```

### Environment variables

You need to add a .env file with this information:

```
NODE_ENV="development"
PORT="3081"
HOST="localhost"
MONGO_CONNECTION_STRING="mongodb://mongo-db:27017"
ACCESS_TOKEN_TTL="15m"
REFRESH_TOKEN_TTL="1y"
PRIVATE_KEY="Your private key" (Generate here: https://travistidwell.com/jsencrypt/demo/)
```