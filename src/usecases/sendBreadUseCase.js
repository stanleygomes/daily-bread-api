// import { fetchText } from '../services/huggingface.js';
import { fetchText } from '../services/aiMlApi';
import { find, create } from '@/services/mongoService';
import { getCurrentDate } from '@/utils/dateFormat';

export async function processSendBread() {
  const today = getCurrentDate();
  const prompt = "Write a short story about a cat that loves to eat bread";
  let messageEmail = prompt;

  const bread = await find('breads', { date: today });
  if (bread.length > 0) {
    messageEmail = bread[0].message;
  } else {
    const message = await fetchText(prompt);
    const bread = await create('breads', {
      date: today,
      message: message,
    });

    messageEmail = bread.message;
  }

  // console.log(teste);
  console.log('prompt', prompt);

}
