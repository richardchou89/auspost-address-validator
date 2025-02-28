import gql from "graphql-tag";

export const typeDefs = gql`
  type Query {
    localities(q: String!, state: String!): [Locality]!
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