import { createApolloServer } from "@/server";
import request from "supertest";
import { startStandaloneServer } from "@apollo/server/standalone";
import { LocalityAPI } from "@/datasources/locality-api";

const queryData = (postcode: string, suburb: string, state: string) => {
  return {
    query: `
      query {
        localities(postcode: "${postcode}", suburb: "${suburb}" state: "${state}") {
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
}


describe("GraphQL API E2E Tests", () => {
  let serverInstance: any;
  let serverURL: string;

  beforeAll(async () => {
    const server = createApolloServer();

    const { url } = await startStandaloneServer(server, {
      listen: { port: 0 },
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

  describe("when postcode, suburb and state are valid", () => {
    it('should return correct message', async () => {
      const response = await request(serverURL).post('staging/postcode/search.json').send(queryData("2000", "Sydney", "NSW")).set("Accept", "application/json");;
      const parsedResponse = JSON.parse(response.text);
      expect(parsedResponse.data.localities.message).toBe("The postcode, suburb, and state input are valid");
    })
  });

  describe("when postcode, suburb and state are valid, and only return one result", () => {
    it('should return correct message', async () => {
      const response = await request(serverURL).post('staging/postcode/search.json').send(queryData("2006", "Sydney", "NSW")).set("Accept", "application/json");;
      const parsedResponse = JSON.parse(response.text);
      expect(parsedResponse.data.localities.message).toBe("The postcode, suburb, and state input are valid");
    })
  });

  describe("when postcode is invalid", () => {
    it('should return correct message', async () => {
      const response = await request(serverURL).post('staging/postcode/search.json').send(queryData("3000", "Sydney", "NSW")).set("Accept", "application/json");;
      const parsedResponse = JSON.parse(response.text);
      expect(parsedResponse.data.localities.message).toBe("The postcode 3000 does not match the suburb Sydney");
    })
  });

  describe("when suburb does not match state", () => {
    it('should return correct message', async () => {
      const response = await request(serverURL).post('staging/postcode/search.json').send(queryData("2000", "Sydney", "ACT")).set("Accept", "application/json");;
      const parsedResponse = JSON.parse(response.text);
      expect(parsedResponse.data.localities.message).toBe("The suburb Sydney does not exist in the state ACT");
    })
  });
});