import { LocalityAPI } from "@/datasources/locality-api";
import { createApolloServer } from "@/server";
import { startServerAndCreateNextHandler } from "@as-integrations/next";

const server = createApolloServer();

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

// export { handler as GET, handler as POST };

export async function GET(request: Request) {
  return handler(request);
}

export async function POST(request: Request) {
  return handler(request);
}
