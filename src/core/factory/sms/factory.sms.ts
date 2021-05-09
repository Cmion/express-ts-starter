import twilio from 'twilio';
import config from 'config';
import logger from '../../../setup/logger.setup';
import { WorkerFactory } from '../worker/worker.factory';
import { ConsumeMessage } from 'amqplib';

export class SMSFactory {
  static SMSQueue = 'sms-queue';

  protected static setupTwilio() {
    const accountSid = config.get<string>('sms.twilio.sid');
    const authToken = config.get<string>('sms.twilio.token');
    return twilio(accountSid, authToken);
  }
  static async sendTwilioVerificationCode(mobile: string, code: string) {
    await WorkerFactory.publish({ mobile, code, smsType: 'twilio' }, SMSFactory.SMSQueue);
  }

  static async $consumeWorker() {
    await WorkerFactory.consume(SMSFactory.SMSQueue, (message: ConsumeMessage) => {
      try {
        const data = JSON.parse(message.content.toString());
        if (data.smsType === 'twilio') {
          SMSFactory.$doTwilioVerificationCode(data.mobile, data.code);
        }
      } catch (e) {
        logger.debug(e);
      }
    });
  }

  protected static async $doTwilioVerificationCode(mobile: string, code: string) {
    const client = SMSFactory.setupTwilio();
    const phoneNumber = config.get<string>('sms.twilio.phoneNumber');
    const appName = config.get<string>('app.appName');
    try {
      const response = await client.messages.create({
        body: `Your ${appName} activation code is ${code}`,
        from: phoneNumber,
        to: mobile,
      });
      return response;
    } catch (e) {
      logger.debug(e);
    }
  }
}
