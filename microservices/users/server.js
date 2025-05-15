const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
const path = require('path');

const PROTO_PATH = path.join(__dirname, 'user.proto');

const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true
});

// 🔴 C’est ici que ça échoue si ton package dans le .proto est mal nommé
const userProto = grpc.loadPackageDefinition(packageDefinition).userPackage;

const users = [
  { id: '1', name: 'Ali', email: 'ali@example.com' },
  { id: '2', name: 'Sana', email: 'sana@example.com' }
];

const server = new grpc.Server();
server.addService(userProto.UserService.service, {
  GetAllUsers: (_, callback) => {
    callback(null, { users });
  }
});

const PORT = '0.0.0.0:50051';
server.bindAsync(PORT, grpc.ServerCredentials.createInsecure(), () => {
  console.log(`✅ UserService running on ${PORT}`);
  server.start();
});
