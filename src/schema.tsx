import gql from "graphql-tag";

export const typeDefs = gql`
  type Query {
    localities(q: String!): LocalitiesResult
  }

  union LocalitiesResult = Locality | LocalityList

  type LocalityList {
    items: [Locality]
  }

  type Locality {
    id: ID!
    category: String!
    latitude: Float!
    longitude: Float!
    location: String!
    postcode: Int!
    state: String!
  }
`;