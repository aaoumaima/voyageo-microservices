const { Kafka } = require('kafkajs');
const kafka = new Kafka({ clientId: 'reservation-consumer', brokers: ['localhost:9092'] });
const consumer = kafka.consumer({ groupId: 'reservation-group' });

const run = async () => {
  await consumer.connect();
  await consumer.subscribe({ topic: 'reservations', fromBeginning: true });

  await consumer.run({
    eachMessage: async ({ message }) => {
      const reservation = JSON.parse(message.value.toString());
      console.log('Reservation received:', reservation);
    }
  });
};

run().catch(console.error);
