import 'module-alias/register';
import Pino from '@/utils/logger.js'

export default async function handler(req, res) {
    if (req.method !== 'GET') {
        return res
          .status(405)
          .json({ message: 'Method not allowed' });
    }

    const { secret } = req.query;

    if (!secret) {
        return res
          .status(400)
          .json({ message: 'Secret not informed' });
    }

    try {
        return res.status(200).json({ message: 'Email sent successfully!' });
    } catch (error) {
        Pino.error(error)

        return res
          .status(500)
          .json({ message: 'Internal server error' });
    }
}
