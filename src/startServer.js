import express from "express";
import mongoose from "mongoose";
import { createServer } from "http";
import { execute, subscribe } from "graphql";
import { ApolloServer } from "apollo-server-express";
import { makeExecutableSchema } from "@graphql-tools/schema";
import { SubscriptionServer } from "subscriptions-transport-ws";

async function startServer({ typeDefs, resolvers }) {
  const PORT = 4000;
  const app = express();
  const httpServer = createServer(app);

  mongoose.connect("mongodb://localhost:27017/graphql", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  const schema = makeExecutableSchema({
    typeDefs,
    resolvers,
  });

  const subscriptionServer = SubscriptionServer.create(
    { schema, execute, subscribe },
    { server: httpServer, path: "/graphql" }
  );

  const server = new ApolloServer({
    schema,
    plugins: [
      {
        async serverWillStart() {
          return {
            async drainServer() {
              subscriptionServer.close();
            },
          };
        },
      },
    ],
  });
  await server.start();
  server.applyMiddleware({ app });

  httpServer.listen(PORT, () =>
    console.log(`🔥 Server is now running on http://localhost:${PORT}/graphql`)
  );
}

export default startServer;
