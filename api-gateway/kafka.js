// api-gateway/kafka.js
const { Kafka } = require('kafkajs');

const kafka = new Kafka({
  clientId: 'gateway',
brokers: ['localhost:9092']});

const producer = kafka.producer();

const initKafka = async () => {
  await producer.connect();
};

const publishLog = async (message) => {
  await producer.send({
    topic: 'logs',
    messages: [{ value: message }]
  });
};

module.exports = { initKafka, publishLog };
