'use strict';
import express, { NextFunction, Request, Response } from 'express';
import fetch from 'node-fetch';
import redis, { RedisClientType } from 'redis';
import { GithubUserData } from './interfaces';

const PORT: number = parseInt(
  process.env.NODE_ENV === 'production'
    ? (process.env.PORT as string | '')
    : '8000',
  10
);

const client: RedisClientType = redis.createClient();

client.connect();

const app = express();

const setResponse = (username: string, repos: string) => {
  return `<h2>${username} has ${repos} repositories on Github.`;
};
/**
 * This is going to make request to GITHUB for a user specific data.
 */
const getNumberOfRepos = async (req: Request, res: Response) => {
  try {
    const { username } = req.params;
    const response = await fetch(`https://api.github.com/users/${username}`);
    const data = (await response.json()) as GithubUserData;
    const repos: string = data.public_repos.toString();
    //set Data with expiration to redis
    client.setEx(username, 3600, repos);

    res.send(setResponse(username, repos));
  } catch (error) {
    console.log(error);
    res.status(500);
  }
};

/**
 * Middleware function for caching
 */

const redisCache = async (req: Request, res: Response, next: NextFunction) => {
  const { username } = req.params;
  const data = await client.get(username).catch((err) => {
    throw err;
  });
  if (data !== null) {
    res.send(setResponse(username, data));
  } else {
    next();
  }
};

app.get('/repos/:username', redisCache, getNumberOfRepos); // add redisCache as a middleware function

app.listen(PORT, () => {
  console.log('Server is alive on PORT', PORT);
});
