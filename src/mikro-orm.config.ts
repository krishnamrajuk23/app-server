import { __prod__ } from "./constant";
import { Post } from "./entities/Post";
import { MikroORM } from "@mikro-orm/core";
import path from 'path';

export default {
    migrations: {
        path: path.join(__dirname,'./migrations'), // path to the folder with migrations
        pattern: /^[\w-]+\d+\.[tj]s$/, 
    },
    entities: [Post], // entities consist of all our database tables
    dbName: 'fullstack',
    type: "postgresql",
    debug: !__prod__,
    //discovery: { warnWhenNoEntities: false },
    user: 'postgres',
    password: 'Sweety',
    port: 5432
} as Parameters<typeof MikroORM.init>[0]