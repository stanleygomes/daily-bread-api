import 'module-alias/register';
import Pino from '@/utils/logger.js'
import validateRequest from '@/middlewares/sendBread.js'

const SECRET_KEY = process.env.SECRET_KEY;

export default async function handler(req, res) {
    if (req.method !== 'GET') {
        return res
          .status(405)
          .json({ message: 'Method not allowed!' });
    }

    validateRequest(req, res);

    try {
        return res.status(200).json({ message: 'Email sent successfully!' });
    } catch (error) {
        Pino.error(error)

        return res
          .status(500)
          .json({ message: 'Internal server error!' });
    }
}
