import { LocalityAPI } from "@/datasources/locality-api";
import { ApolloServer } from "@apollo/server";
import { startServerAndCreateNextHandler } from "@as-integrations/next";
import gql from "graphql-tag";
import { typeDefs } from "@/schema";
import { resolvers } from "@/resolvers";

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

const handler = startServerAndCreateNextHandler(server, {
  context: async () => {
    const { cache } = server;

    return {
      dataSources: {
        localityAPI: new LocalityAPI({ cache }),
      },
    };
  },
});

export async function GET(
  req: Request,
) {
  return handler(req)
}

export async function POST(
  req: Request,
) {
  return handler(req)
}