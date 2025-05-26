import axios from 'axios';
import { config } from '@/config/config.js';
import { logger } from '@/utils/logger';

const { apiUrl, apiKey, emailTo } = config.services.resend;

export async function sendWithParams(subject, htmlBody) {
  try {
    logger.info('Sending email via Resend API with subject:', subject);
    const response = await axios.post(
      apiUrl,
      {
        from: 'Acme <onboarding@resend.dev>',
        html: htmlBody,
        subject: subject,
        to: [emailTo],
      },
      {
        headers: {
          Authorization: `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
      }
    );

    return response;
  } catch (error) {
    logger.error('Error sending email via Resend API:', error.response?.data || error.message);
    throw error;
  }
}
