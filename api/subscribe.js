// import 'module-alias/register';
import { logger } from '../src/utils/logger';
import { validateRequest } from '../src/middlewares/getBread';
import { getForm } from '../src/usecases/subscribeUseCase';
import { BusinessError } from '../src/domain/errors/BusinessError';

export default async function handler(req, res) {
  const result = await validateRequest(req, false);
  if (result.status !== 200) {
    return res.status(result.status).json({ message: result.message });
  }

  try {
    const html = await getForm();
    res.setHeader('Content-Type', 'text/html');
    return res.status(200).send(html);
  } catch (error) {
    logger.error(error);

    if (error instanceof BusinessError) {
      return res.status(400).json({ message: error.message });
    }

    return res.status(500).json({ message: 'Internal server error!', error: error.message });
  }
}
