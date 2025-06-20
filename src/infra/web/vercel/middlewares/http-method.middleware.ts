import { VercelRequest, VercelResponse } from "@vercel/node";

export class HttpMethodMiddleware {
  static ensure(req: VercelRequest, res: VercelResponse, method: string): boolean {
    if (req.method !== method) {
      res.status(405).json({ message: 'Method not allowed!' });
      return true;
    }
    return false;
  }
}
