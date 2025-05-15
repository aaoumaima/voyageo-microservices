const { gql } = require('apollo-server-express');

const typeDefs = gql`
  type Destination {
    id: ID!
    name: String!
    description: String!
    country: String!  # ✅ Ajouté ici
  }

  type User {
    id: ID!
    name: String!
    email: String!
  }

  type Query {
    getUser(id: ID!): User
    getDestination(id: ID!): Destination
    searchDestinations(query: String!): [Destination]
  }
`;

module.exports = typeDefs;
