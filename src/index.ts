import "reflect-metadata";
import { MikroORM } from "@mikro-orm/core";
import express from "express";
import { ApolloServer } from "apollo-server-express";
import { buildSchema } from "type-graphql";
import redis from "redis";
import session from "express-session";
import connectRedis from "connect-redis";

import { __prod__ } from "./constant";
import { Post } from "./entities/Post";
import ormConfig from "./mikro-orm.config";

import { HelloResolver } from "./resolvers/hello";
import { PostResolver } from "./resolvers/Post";
import { UserResolver } from "./resolvers/User";
import { MyContext } from "./types";

const main = async () => {
  /*---------------Connecting to database and running migration Start -------*/
  const orm = await MikroORM.init(ormConfig);
  orm.getMigrator().up();
  /*---------------Connecting to database and running migration end-------*/

  const app = express();

  const RedisStore = connectRedis(session);
  const redisClient = redis.createClient();

  // app.use(cors({
  //     credentials: true,
  //     origin: 'http://localhost:3000/'
  // }))
  app.use(
    session({
      name: "qid",
      store: new RedisStore({
        client: redisClient,
        disableTouch: true,
      }),
      cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 365, // one year,
        httpOnly: true,
        sameSite: "lax", // csrf
        secure: __prod__, // cookies only works with https
      },
      saveUninitialized: false,
      secret: "kkkrishnnnnammmraaajjjjjuuu",
      resave: false,
    })
  );

  const apolloServer = new ApolloServer({
    schema: await buildSchema({
      resolvers: [HelloResolver, PostResolver, UserResolver],
      validate: false,
    }),
    context: ({ req, res }): MyContext => ({ em: orm.em, req, res }),
  });

  apolloServer.applyMiddleware({ app, cors: { origin: "*" } });

  app.get("/", (_, res) => {
    res.send("hello");
  });
  app.listen(4000, () => {
    console.log("server start at localhost: 4000");
  });
  // const post = orm.em.create(Post, { title: 'hello world' });
  // orm.em.persistAndFlush(post);

  const post = await orm.em.find(Post, {});
  console.log(post);
};

main().catch((err) => {
  console.log(err);
});
