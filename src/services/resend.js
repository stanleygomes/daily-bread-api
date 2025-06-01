import { Resend } from 'resend';
import { config } from '../config/config.js';
import { logger } from '../utils/logger';

const { apiKey, emailTo } = config.services.resend;
const resend = new Resend(apiKey);

export async function sendWithParams(emailToList, subject, htmlBody) {
  try {
    const { data, error } = await resend.emails.send({
      from: 'DailyBread <onboarding@resend.dev>',
      to: emailToList,
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

/**
 * Envia emails em blocos de até 50 destinatários por vez.
 * @param {string[]} emailList Lista de emails
 * @param {string} subject Assunto do email
 * @param {string} htmlBody Corpo HTML do email
 */
export async function sendBulkEmails(emailList, subject, htmlBody) {
  const BATCH_SIZE = 50;
  const results = [];

  for (let i = 0; i < emailList.length; i += BATCH_SIZE) {
    const batch = emailList.slice(i, i + BATCH_SIZE);
    try {
      const result = await sendWithParams(batch, subject, htmlBody);
      results.push(result);
    } catch (error) {
      logger.error(`Erro ao enviar lote de emails (${i} - ${i + batch.length - 1}):`, error);
      results.push({ error, batch });
    }
  }

  return results;
}
