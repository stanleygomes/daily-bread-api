import 'module-alias/register';
import Pino from '@/utils/logger.js'
import validateRequest from '@/middlewares/sendBread';

export default async function handler(req, res) {
  const result = await validateRequest(req);
  if (result.status !== 200) {
    return res
      .status(result.status)
      .json({ message: result.message });
  }

  try {
    return res
      .status(200)
      .json({ message: 'Email sent successfully!' });
  } catch (error) {
    Pino.error(error)
    return res
      .status(500)
      .json({ message: 'Internal server error!' });
  }
}
