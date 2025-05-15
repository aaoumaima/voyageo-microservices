const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
const path = require('path');
const fs = require('fs');

// Le chemin vers le bon fichier .proto
const PROTO_PATH = path.join(__dirname, 'destinations.proto');

// Charger le fichier .proto
const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true
});
const destinationProto = grpc.loadPackageDefinition(packageDefinition).destinationPackage;

// Charger les données (fichier JSON par exemple)
const destinations = JSON.parse(fs.readFileSync(path.join(__dirname, 'data.json'), 'utf-8'));

const server = new grpc.Server();

// Définir les méthodes du service
server.addService(destinationProto.DestinationService.service, {
  GetAllDestinations: (_, callback) => {
    callback(null, { destinations });
  }
});

// Démarrer le serveur
const PORT = '0.0.0.0:50052';
server.bindAsync(PORT, grpc.ServerCredentials.createInsecure(), (err, port) => {
  if (err) {
    console.error('Erreur lors du démarrage du serveur gRPC:', err);
    return;
  }
  console.log(`✅ Microservice Destinations gRPC lancé sur ${PORT}`);
  server.start();
});
