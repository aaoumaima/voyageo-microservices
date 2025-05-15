const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
const packageDef = protoLoader.loadSync('users.proto');
const grpcObject = grpc.loadPackageDefinition(packageDef);
const userPackage = grpcObject.userPackage;

const users = [
  { id: '1', name: 'Ali', email: 'ali@example.com' },
  { id: '2', name: 'Sara', email: 'sara@example.com' },
];

function getUser(call, callback) {
  const user = users.find(u => u.id === call.request.id);
  if(user) callback(null, user);
  else callback({ code: grpc.status.NOT_FOUND, details: "User not found" });
}

function main() {
  const server = new grpc.Server();
  server.addService(userPackage.User.service, { getUser });
  server.bindAsync('0.0.0.0:50051', grpc.ServerCredentials.createInsecure(), () => {
    console.log('Users microservice running at http://0.0.0.0:50051');
    server.start();
  });
}

main();
