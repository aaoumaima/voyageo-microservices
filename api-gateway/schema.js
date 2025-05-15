const { gql } = require('apollo-server-express');

const typeDefs = gql`
  type User {
    id: ID
    name: String
  }

  type Destination {
    id: ID
    name: String
    description: String
    country: String
  }

  type Query {
    users: [User]
    destinations: [Destination]
    searchDestinations(query: String): [Destination]
  }
`;

module.exports = typeDefs;
