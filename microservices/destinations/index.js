const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
const packageDef = protoLoader.loadSync('destinations.proto');
const grpcObject = grpc.loadPackageDefinition(packageDef);
const destPackage = grpcObject.destPackage;

const destinations = [
  { id: '1', name: 'Carthage', description: 'Ancient city in Tunisia', country: 'Tunisie' },
  { id: '2', name: 'Sousse', description: 'Tourist city', country: 'Tunisie' },
];

function getDestination(call, callback) {
  const dest = destinations.find(d => d.id === call.request.id);
  if(dest) callback(null, dest);
  else callback({ code: grpc.status.NOT_FOUND, details: "Destination not found" });
}

function main() {
  const server = new grpc.Server();
  server.addService(destPackage.Destination.service, { getDestination });
  server.bindAsync('0.0.0.0:50052', grpc.ServerCredentials.createInsecure(), () => {
    console.log('Destinations microservice running at http://0.0.0.0:50052');
    server.start();
  }); app.listen(4000, () => {
  console.log('Server ready at http://localhost:4000/');
});

}

main();
