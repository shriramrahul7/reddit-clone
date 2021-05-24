import { MikroORM } from "@mikro-orm/core";
import "reflect-metadata";
import { __prod__ } from "./constants";
import mikroOrmConfig from "./mikro-orm.config";
import express from "express";
import { ApolloServer } from "apollo-server-express";
import { buildSchema } from "type-graphql";
import { HelloResolver } from "./resolvers/Hello";
import { PostResolver } from "./resolvers/posts";
import { UserResolver } from "./resolvers/user";
// import { schema } from "./schema/schema..";

const main = async () => {
  const orm = await MikroORM.init(mikroOrmConfig);
  await orm.getMigrator().up();

  const app = express();

  const apolloServer = new ApolloServer({
    schema: await buildSchema({
      resolvers: [HelloResolver, PostResolver, UserResolver],
      validate: false,
    }),
    context: {
      em: orm.em,
    },
  });

  apolloServer.applyMiddleware({ app });

  app.get("/", (_, res) => {
    res.send("Hello client!");
  });

  app.listen(4000, () => {
    console.log("server is listening on localhost://4000");
  });
};

main().catch((err) => {
  console.log(err.message);
});
