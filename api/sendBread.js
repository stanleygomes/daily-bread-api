import 'module-alias/register';
import { logger } from '@/utils/logger';
import { validateRequest } from '@/middlewares/sendBread';
import { processSendBread } from '@/usecases/sendBreadUseCase'

export default async function handler(req, res) {
  const result = await validateRequest(req);
  if (result.status !== 200) {
    return res.status(result.status).json({ message: result.message });
  }

  try {
    await processSendBread()
    return res.status(200).json({ message: 'Email sent successfully!' });
  } catch (error) {
    logger.error(error);
    return res.status(500).json({ message: 'Internal server error!' });
  }
}
