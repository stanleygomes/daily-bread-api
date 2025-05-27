// import 'module-alias/register';
import { logger } from '../src/utils/logger';
import { validateRequest } from '../src/middlewares/sendBread';
import { processSendBread } from '../src/usecases/sendBreadUseCase';
import { BusinessError } from '../src/domain/errors/BusinessError';

export default async function handler(req, res) {
  const result = await validateRequest(req);
  if (result.status !== 200) {
    return res.status(result.status).json({ message: result.message });
  }

  try {
    await processSendBread(req.query.refresh === 'true');
    return res.status(200).json({ message: 'Email sent successfully!' });
  } catch (error) {
    logger.error(error);

    if (error instanceof BusinessError) {
      return res.status(400).json({ message: error.message });
    }

    return res.status(500).json({ message: 'Internal server error!', error: error.message });
  }
}
