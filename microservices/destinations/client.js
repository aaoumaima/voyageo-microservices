const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
const path = require('path');

// Chemin vers le fichier .proto
const PROTO_PATH = path.join(__dirname, 'destinations.proto');

// Charger le .proto
const packageDefinition = protoLoader.loadSync(PROTO_PATH);
const destinationsProto = grpc.loadPackageDefinition(packageDefinition).destinations;

// Créer un client gRPC
const client = new destinationsProto.DestinationService(
  'localhost:50052',
  grpc.credentials.createInsecure()
);

// Appeler GetDestination
client.GetDestination({ destination_id: '1' }, (err, response) => {
  if (err) {
    console.error('❌ Erreur :', err);
  } else {
    console.log('✅ Destination reçue :');
    console.log(response.destination);
  }
});
