import gql from "graphql-tag";

export const typeDefs = gql`
  type Query {
    localities(postcode: String!, suburb: String!, state: String!): LocalityResult!
  }

  type LocalityResult {
    message: String!
    items: [Locality]!
  }

  type Locality {
    id: ID!
    category: String
    latitude: Float
    longitude: Float
    location: String
    postcode: Int
    state: String
  }
`;