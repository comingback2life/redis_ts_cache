# Redis Tutorial using TypeScript.

This tutorial fetches user data using the Github API.

Using the data from the Github API, it stores the user's public repository count in a Redis cache and sends back a simple <h1> tag with the username and the repository count.

## API Reference

#### Get a users github public repository count

```http
  POST /repos/:username
```

| Parameter  | Type     | Description                        |
| :--------- | :------- | :--------------------------------- |
| `username` | `string` | **Required**. Github user username |

Takes the github username and returns the cache.

## Run Locally

## Redis is required for this to run locally.

For installation instructions : https://redis.io/docs/getting-started/

## If you have Redis installed :

Clone the project

```bash
  git clone https://github.com/comingback2life/redis_ts_cache.git
```

Go to the project directory

```bash
  cd redis_ts_cache
```

Install dependencies

```bash
  npm install
```

Start the server

```bash
  npm run start
```

## More on Redis

#### Redis Docs

https://redis.io

#### NPM

https://www.npmjs.com/package/redis

## Demo

https://redis-ts-cache.onrender.com/repos/comingback2life
