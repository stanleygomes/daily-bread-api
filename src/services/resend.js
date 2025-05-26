import { Resend } from 'resend';
import { config } from '@/config/config.js';
import { logger } from '@/utils/logger';

const { apiKey, emailTo } = config.services.resend;
const resend = new Resend(apiKey);

export async function sendWithParams(subject, htmlBody) {
  try {
    const { data, error } = await resend.emails.send({
      from: 'DailyBread <onboarding@resend.dev>',
      to: emailTo,
      subject,
      html: htmlBody,
    });

    if (error) {
      logger.error('Error in response of sending email:', error);
      throw new Error("Error in response of sending email: " + error.message);
    }

    return data;
  } catch (error) {
    logger.error('Error sending email:', error);
    throw new Error("Error sending email: " + error.message);
  }
}
