import type { VercelResponse } from '@vercel/node';

export class ResponseHandlerMiddleware {
  static html(res: VercelResponse, html: string): void {
    res.setHeader('Content-Type', 'text/html');
    res.status(200).send(html);
  }

  static json(res: VercelResponse, content: any): void {
    res.setHeader('Content-Type', 'application/json');
    res.status(200).json(content);
  }
}
