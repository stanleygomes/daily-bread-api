export default async function validateRequest(req, res) {
    if (req.method !== 'GET') {
        return res
          .status(405)
          .json({ message: 'Method not allowed!' });
    }

    const { secret } = req.query;

    if (!secret) {
        return res
          .status(400)
          .json({ message: 'Secret not informed!' });
    }

    if (secret !== process.env.SECRET_KEY) {
        return res
          .status(400)
          .json({ message: 'Secret is invalid!' });
    }
}
