// import { fetchText } from '../services/huggingface.js';
import { fetchText } from '../services/aiMlApi';
import { find, create } from '../services/mongoService';
import { getCurrentDate } from '../utils/dateFormat';
import imageContent from '../assets/image-list.json'
import { logger } from '../utils/logger';
import { sendBulkEmails } from '../services/resend';
import { renderHtml } from '../utils/buildTemplate';
import { prompt } from '../assets/prompt'
import { BusinessError } from '../domain/errors/BusinessError';

export async function processSendBread(refresh = false) {
  const today = getCurrentDate();
  let messageEmail = null;

  const bread = await find('breads', { date: today });
  if (bread.length == 0 || refresh === true) {
    const image = getImage()
    const now = new Date()
    const message = await fetchText(prompt);

    const messageJSON = JSON.parse(message)
    const breadToCreate = {
      ...messageJSON,
      ...{
        date: today,
        created_at: now,
        image: image,
      }
    }
    await create('breads', breadToCreate);
    messageEmail = breadToCreate;
  } else {
    const count = bread.length
    messageEmail = bread[count - 1];
  }

  await sendEmail(messageEmail)
}

function getImage() {
  const { images } = imageContent

  if (!images || images.length === 0) {
    logger.error("Lista de imagens vazia ou inválida.");
    throw new BusinessError("Lista de imagens vazia ou inválida.");
  }

  const randomIndex = Math.floor(Math.random() * images.length);
  return images[randomIndex];
}

async function sendEmail(params) {
  const subscribers = await find('subscribers', { enabled: true });
  const emailToList = subscribers.map(subscriber => subscriber.email);

  const html = renderHtml(params, 'email', 'daily.html');
  const subject = `🙏 Devocional do dia - ${params.title}`;

  console.log('subscribers', subscribers);
  console.log('emailToList', emailToList);

  await sendBulkEmails(emailToList, subject, html)
}
