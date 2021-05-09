import amqplib, { Channel, Connection, ConsumeMessage } from 'amqplib';
import config from 'config';
import { isFunction } from 'lodash';

export class WorkerFactory {
  static connection = WorkerFactory.connect();

  protected static async connect() {
    const serverURI = config.get('worker.rabbitmq.uri');
    try {
      const connection = await amqplib.connect(serverURI);
      return connection;
    } catch (e) {
      throw e;
    }
  }

  /**
   * publish
   */
  static async publish(message: any, queue: string) {
    const connection = await WorkerFactory.connect();
    // Creates a message channel
    const channel = await connection.createChannel();
    // Finds or create a queue
    channel.assertQueue(queue);
    // Sends message to queue
    channel.sendToQueue(queue, Buffer.from(JSON.stringify(message)));
    // // Close channel and connection
    // await channel.close();
    // await connection.close();
  }

  /**
   * consume
   */
  static async consume(queue: string, onMessage: (message: ConsumeMessage) => void): Promise<Channel> {
    const connection = await WorkerFactory.connect();
    // Creates a message channel
    const channel = await connection.createChannel();
    // Finds or create a queue
    channel.assertQueue(queue);
    channel.consume(queue, (message: ConsumeMessage) => {
      if (message !== null) {
        if (isFunction(onMessage)) onMessage(message);
        channel.ack(message);
      }
    });

    return channel;
  }
}
