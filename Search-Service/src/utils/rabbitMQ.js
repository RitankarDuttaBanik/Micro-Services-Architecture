const amqp = require('amqplib')
const logger = require('./logger.js');

let connection = null;
let channel = null;

const Exchange_Unique_Name = 'Social_Media_events';


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

async function consumeEvent(routingKey,callback){
    if(!channel){
        channel = await ConnectRabbitMQ();
    }
    const q = await channel.assertQueue("",{exclusive : true});
    await channel.bindQueue(q.queue,Exchange_Unique_Name,routingKey);
    channel.consume(q.queue, (msg) => {
        if (msg !== null) {
            const content = JSON.parse(msg.content.toString());
            callback(content);
            channel.ack(msg);

        }

    });

    logger.info(`Subscribed to the event : ${routingKey}`);

}

module.exports = { ConnectRabbitMQ,consumeEvent};