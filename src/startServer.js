import { ApolloServer, PubSub } from "apollo-server";
import mongoose from "mongoose";

function startServer({ typeDefs, resolvers }) {
  mongoose.connect("mongodb://localhost:27017/graphql", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  const pubsub = new PubSub();
  const server = new ApolloServer({ typeDefs, resolvers, context: { pubsub } });
  server
    .listen()
    .then(({ url }) => console.log(`🔥 Server is running on ${url}`));
}

export default startServer;
