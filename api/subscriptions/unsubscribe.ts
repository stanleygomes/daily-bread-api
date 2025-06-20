import '../src/infra/providers/dependencies.js';
import type { VercelRequest, VercelResponse } from '@vercel/node';
import { subscriptionRoutes } from '../../src/infra/providers/dependencies.js';

export default function handler(req: VercelRequest, res: VercelResponse): void {
  if (req.method === 'GET') {
    subscriptionRoutes.renderPageUnSubscribe(req, res);
  } else if (req.method === 'POST') {
    subscriptionRoutes.unsubscribe(req, res);
  } else {
    res.status(405).json({ message: 'Method not allowed!' });
  }
}
