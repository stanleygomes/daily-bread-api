// import { fetchText } from '../services/huggingface.js';
import { fetchText } from '../services/aiMlApi';
import { find, create } from '@/services/mongoService';
import { getCurrentDate } from '@/utils/dateFormat';
import { loadFileContent } from '@/utils/file';
import imageContent from '@/assets/image-list.json'
import { logger } from '@/utils/logger';
import { sendWithParams } from '@/services/resend';
import { renderEmailHtml } from '@/utils/buildTemplate';

export async function processSendBread(refresh = false) {
  const today = getCurrentDate();
  const prompt = loadFileContent('src/assets/prompt.txt');
  let messageEmail = prompt;

  const bread = await find('breads', { date: today });
  if (bread.length == 0 || refresh === true) {
    const message = await fetchText(prompt);
    const messageJSON = JSON.parse(message)
    await create('breads', {
      date: today,
      message: messageJSON,
    });
    messageEmail = messageJSON;
  } else {
    const count = bread.length
    messageEmail = bread[count - 1].message;
  }

  await sendEmail(messageEmail)
}

function getImage() {
  const { images } = imageContent

  if (!images || images.length === 0) {
    logger.error("Lista de imagens vazia ou inválida.");
    throw new Error("Lista de imagens vazia ou inválida.");
  }

  const randomIndex = Math.floor(Math.random() * images.length);
  return images[randomIndex];
}

async function sendEmail(messageEmail) {
  const image = getImage()
  const params = {
    ...messageEmail,
    ...{
      imageUrl: image,
    }
  }

  const html = renderEmailHtml(params, 'html', 'email.html');
  const subject = `🙏 Devocional do dia - ${params.title}`;

  await sendWithParams(subject, html)
}
