const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
const path = require('path');

const PROTO_PATH = path.join(__dirname, 'users.proto');

// Charger le fichier .proto
const packageDefinition = protoLoader.loadSync(PROTO_PATH);
const usersProto = grpc.loadPackageDefinition(packageDefinition).users;

// Créer le client gRPC
const client = new usersProto.UserService(
  'localhost:50051',
  grpc.credentials.createInsecure()
);

// Envoyer la requête GetUser
client.GetUser({ id: '1' }, (err, response) => {
  if (err) {
    console.error('Erreur :', err);
  } else {
    console.log('✅ Utilisateur reçu :');
    console.log(response);
  }
});
