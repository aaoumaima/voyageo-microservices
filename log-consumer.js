const { Kafka } = require('kafkajs');
const fs = require('fs');

const kafka = new Kafka({
  clientId: 'logger',
  brokers: ['localhost:9092'],
});

const consumer = kafka.consumer({ groupId: 'log-group' });

async function run() {
  await consumer.connect();
  await consumer.subscribe({ topic: 'logs', fromBeginning: true });

  await consumer.run({
    eachMessage: async ({ message }) => {
      const log = `📝 Nouveau log : ${message.value.toString()}`;
      console.log(log);
      fs.appendFileSync('logs.txt', log + '\n');
    },
  });
}

run().catch(console.error);
