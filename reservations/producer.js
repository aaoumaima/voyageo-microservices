const { Kafka } = require('kafkajs');
const kafka = new Kafka({ clientId: 'reservation-producer', brokers: ['localhost:9092'] });
const producer = kafka.producer();

const run = async () => {
  await producer.connect();
  await producer.send({
    topic: 'reservations',
    messages: [{ value: JSON.stringify({ userId: '1', eventId: '2' }) }]
  });
  console.log('Reservation sent');
};

run().catch(console.error);
