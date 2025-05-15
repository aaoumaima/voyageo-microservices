const { ApolloServer } = require('apollo-server-express');
const express = require('express');
const path = require('path');
const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
const { Kafka } = require('kafkajs');
const typeDefs = require('./schema');
const resolvers = require('./resolvers');

const app = express();

// --- gRPC Clients ---

// Chargement user.proto
const userProtoPath = path.join(__dirname, '../microservices/users/user.proto');
const userDef = protoLoader.loadSync(userProtoPath, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});
const userPackage = grpc.loadPackageDefinition(userDef).userPackage;
const userClient = new userPackage.UserService('localhost:50051', grpc.credentials.createInsecure());

// Chargement destination.proto
const destProtoPath = path.join(__dirname, '../microservices/destinations/destination.proto');
const destDef = protoLoader.loadSync(destProtoPath, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});
const destPackage = grpc.loadPackageDefinition(destDef).destinationPackage;
const destClient = new destPackage.DestinationService('localhost:50052', grpc.credentials.createInsecure());

// --- Kafka Producer ---
let kafkaProducer;

async function initKafka() {
  const kafka = new Kafka({
    clientId: 'gateway',
    brokers: ['127.0.0.1:9092'],
  });
  kafkaProducer = kafka.producer();
  await kafkaProducer.connect();
}

// --- Routes REST ---
app.get('/user/:id', (req, res) => {
  userClient.GetUser({ id: req.params.id }, (err, response) => {
    if (err) return res.status(500).send(err);
    return res.json(response);
  });
});

app.get('/destination/:id', (req, res) => {
  destClient.GetDestination({ destination_id: req.params.id }, (err, response) => {
    if (err) return res.status(500).send(err);
    return res.json(response.destination);
  });
});

// --- GraphQL ---
async function startServer() {
  const server = new ApolloServer({
    typeDefs,
    resolvers: {
      ...resolvers,
      Query: {
        ...resolvers.Query,
        async searchDestinations(_, { query }) {
          if (kafkaProducer) {
            await kafkaProducer.send({
              topic: 'logs',
              messages: [{ value: `Recherche destinations: ${query}` }],
            });
          }
          return resolvers.Query.searchDestinations(_, { query });
        },
      },
    },
  });

  await server.start();
  server.applyMiddleware({ app });
  await initKafka();

  app.listen(4000, () => {
    console.log('🚀 API Gateway REST + GraphQL sur http://localhost:4000');
    console.log('🔎 Test REST user: http://localhost:4000/user/1');
    console.log('🔎 Test REST destination: http://localhost:4000/destination/1');
    console.log('🧠 GraphQL: http://localhost:4000/graphql');
  });
}

startServer();
