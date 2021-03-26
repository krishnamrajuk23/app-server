import { MikroORM } from "@mikro-orm/core";
import { __prod__ } from "./constant";
import { Post } from "./entities/Post";
import ormConfig from "./mikro-orm.config";
import express from 'express';
import { ApolloServer } from "apollo-server-express";
import { buildSchema } from "type-graphql";
import { HelloResolver } from "./resolvers/hello";

const main = async () => {
    /*---------------Connecting to database and running migration Start -------*/
    const orm = await MikroORM.init(ormConfig);
    orm.getMigrator().up();
    /*---------------Connecting to database and running migration end-------*/

    const app = express();

    const apolloServer = new ApolloServer({
        schema: await buildSchema({
            resolvers: [HelloResolver],
            validate: false
        })
    });

    apolloServer.applyMiddleware({ app });

    app.get("/", (_, res) => {
        res.send("hello");
    })
    app.listen(4000, () => {
        console.log("server start at localhost: 4000")
    })
    // const post = orm.em.create(Post, { title: 'hello world' });
    // orm.em.persistAndFlush(post);

    const post = await orm.em.find(Post, {});
    console.log(post);
}

main().catch(err => {
    console.log(err);
});
