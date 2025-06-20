import { Resend } from 'resend';
import { config } from '../../config/index.js';
import { Logger } from '../../logger/pino.logger.js';
import { IEmailService } from '../../../domain/port/services/email.service.js';

const {
  apiKey,
  emailFrom,
} = config.services.resend;

export class ResendService implements IEmailService{
  private resend = new Resend(apiKey);
  private logger = Logger.getLogger();

  async sendBulkEmails(emailList: string[], subject: string, htmlBody: string): Promise<any[]> {
    const BATCH_SIZE = 50;
    const results = [];

    for (let i = 0; i < emailList.length; i += BATCH_SIZE) {
      const batch = emailList.slice(i, i + BATCH_SIZE);
      try {
        const result = await this.sendWithParams(batch, subject, htmlBody);
        results.push(result);
      } catch (error) {
        this.logger.error(`Erro ao enviar lote de emails (${i} - ${i + batch.length - 1}):`, error);
        results.push({ error, batch });
      }
    }

    return results;
  }

  private async sendWithParams(emailToList: string[], subject: string, htmlBody: string): Promise<any> {
    try {
      const { data, error } = await this.resend.emails.send({
        from: emailFrom!,
        to: emailToList,
        subject,
        html: htmlBody,
      });

      if (error) {
        this.logger.error('Error in response of sending email:', error);
        throw new Error("Error in response of sending email: " + error.message);
      }

      return data;
    } catch (error: any) {
      this.logger.error('Error sending email:', error);
      throw new Error("Error sending email: " + error.message);
    }
  }
}
