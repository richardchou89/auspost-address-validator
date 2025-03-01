import { createApolloServer } from "@/server";
import request from "supertest";
import { startStandaloneServer } from "@apollo/server/standalone";
import { LocalityAPI } from "@/datasources/locality-api";
import { Princess_Sofia } from "next/font/google";

const queryData = {
  query: `
    query {
      localities(postcode: "2000", suburb: "Sydney" state: "NSW") {
        message
        items {
          id
          postcode
          location
          latitude
          longitude
          state
          category
        }
      }
    }
  `
}

describe("GraphQL API E2E Tests", () => {
  let serverInstance: any;
  let serverURL: string;

  beforeAll(async () => {
    const server = createApolloServer();

    const { url } = await startStandaloneServer(server, {
      listen: { port: 4001 },
      context: async () => ({
        dataSources: {
          localityAPI: new LocalityAPI(),
        },
      }),
    });

    serverInstance = server;
    serverURL = url;
  });

  afterAll(async () => {
    await serverInstance.stop();
  });

  it('', async () => {
    const response = await request(serverURL).post('staging/postcode/search.json').send(queryData).set("Accept", "application/json");;
    console.log(JSON.parse(response.text));
  })
});