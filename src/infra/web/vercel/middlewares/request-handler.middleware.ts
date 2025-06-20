import { VercelRequest, VercelResponse } from "@vercel/node";
import { BusinessError } from "../../../../domain/errors/BusinessError.js";
import { Logger } from "../../../logger/pino.logger.js";

export class RequestHandlerMiddleware {
  private static logger = Logger.getLogger();

  static asyncHandler(
    handler: (req: VercelRequest, res: VercelResponse) => Promise<void>
  ) {
    return async (req: VercelRequest, res: VercelResponse) => {
      try {
        await handler(req, res);
      } catch (error: any) {
        this.logger.error(error);

        if (error instanceof BusinessError) {
          res.status(400).json({ message: error.message });
          return;
        }

        res.status(500).json({ message: 'Internal server error!', error: error.message });
      }
    };
  }
}
