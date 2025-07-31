const amqp = require('amqplib')
const logger = require('./logger.js');

let connection = null;
let channel = null;

const Exchange_Unique_Name = 'Social_Media_events'


async function ConnectRabbitMQ() {
    try {

        connection = await amqp.connect(process.env.RABBITMQ_URL);
        channel = await connection.createChannel();

        await channel.assertExchange(Exchange_Unique_Name, "topic", { durable: false });
        logger.info('connected to RabbitMQ');
        return channel;
    } catch (error) {
        logger.error('Cannot connect RabbitMQ', error);
        throw error
    }

}

async function PublishEvent(routingKey, message) {
    try {
        if (!channel) {
            channel = await ConnectRabbitMQ();
        }
        channel.publish(
        Exchange_Unique_Name, 
        routingKey, 
        Buffer.from(JSON.stringify(message)));
        logger.info(`Published event with routing key ${routingKey}`);

    } catch (error) {
        logger.error('Cannot publish event', error);
        throw error
    }
}

module.exports = { ConnectRabbitMQ, PublishEvent };