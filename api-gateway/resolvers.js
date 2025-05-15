// resolvers.js

const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
const path = require('path');

const userProtoPath = path.join(__dirname, '../microservices/users/user.proto');
const userPackageDefinition = protoLoader.loadSync(userProtoPath, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});
const userProto = grpc.loadPackageDefinition(userPackageDefinition).userPackage;

const destinationProtoPath = path.join(__dirname, '../microservices/destinations/destination.proto');
const destinationPackageDefinition = protoLoader.loadSync(destinationProtoPath, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});
const destinationProto = grpc.loadPackageDefinition(destinationPackageDefinition).destinationPackage;

const userClient = new userProto.UserService('localhost:50051', grpc.credentials.createInsecure());
const destinationClient = new destinationProto.DestinationService('localhost:50052', grpc.credentials.createInsecure());

const resolvers = {
  Query: {
    users: (_, __) => {
      return new Promise((resolve, reject) => {
        userClient.listUsers({}, (error, response) => {
          if (error) return reject(error);
          resolve(response.users);
        });
      });
    },
    destinations: (_, __) => {
      return new Promise((resolve, reject) => {
        destinationClient.listDestinations({}, (error, response) => {
          if (error) return reject(error);
          resolve(response.destinations);
        });
      });
    },
  },

  Mutation: {
    addUser: (_, { userInput }) => {
      return new Promise((resolve, reject) => {
        userClient.addUser(userInput, (error, response) => {
          if (error) return reject(error);
          resolve(response);
        });
      });
    },

    addDestination: (_, { destinationInput }) => {
      return new Promise((resolve, reject) => {
        destinationClient.addDestination(destinationInput, (error, response) => {
          if (error) return reject(error);
          resolve(response);
        });
      });
    },
  },
};

module.exports = resolvers;
