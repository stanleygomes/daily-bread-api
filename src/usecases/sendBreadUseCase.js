// import { fetchText } from '../services/huggingface.js';
import { fetchText } from '../services/aiMlApi';

export async function processSendBread() {

  const prompt = "Write a short story about a cat that loves to eat bread";
  const teste = await fetchText(prompt);

  console.log(teste);
}
