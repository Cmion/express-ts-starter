import twilio from 'twilio';
import config from 'config';
import logger from '../../../setup/logger.setup';

export class SMSFactory {
  protected setupTwilio() {
    const accountSid = config.get<string>('sms.twilio.sid');
    const authToken = config.get<string>('sms.twilio.token');
    return twilio(accountSid, authToken);
  }
  public async sendTwilioVerificationCode(mobile: string, code: string) {
    const client = this.setupTwilio();
    const phoneNumber = config.get<string>('sms.twilio.phoneNumber');
    try {
      const response = await client.messages.create({
        body: `Your Fibonacci activation code is ${code}`,
        from: phoneNumber,
        to: mobile,
      });
      return response
    } catch (e) {
      logger.debug(e);
    }
  }
}
