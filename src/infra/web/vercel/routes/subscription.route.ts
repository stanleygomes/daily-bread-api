import { VercelRequest, VercelResponse } from "@vercel/node";
import { RenderPageUseUseCase } from "../../../../application/usecases/render-page-use-case.js";
import { BusinessError } from "../../../../domain/errors/BusinessError.js";
import { CorsMiddleware } from "../middlewares/cors.middleware.js";
import { RequestHandlerMiddleware } from "../middlewares/request-handler.middleware.js";
import { ResponseHandlerMiddleware } from "../middlewares/response-handler.middleware.js";
import { SetSubscriberEnabledUseCase } from "../../../../application/usecases/set-subscriber-enabled-use-case.js";

export class SubscriptionRoutes {
  constructor(
    private readonly setSubscriberEnabledUseCase: SetSubscriberEnabledUseCase,
    private readonly renderPageUseUseCase: RenderPageUseUseCase,
  ) {}

  subscribe = RequestHandlerMiddleware.asyncHandler(async (req: VercelRequest, res: VercelResponse): Promise<void> => {
    if (CorsMiddleware.apply(req, res)) return;

    const email = this.getBodyEmail(req);
    const data = await this.setSubscriberEnabledUseCase.execute(email, true);
    const response = await this.renderPageUseUseCase.execute(data, 'page/subscribe-success.html')
    ResponseHandlerMiddleware.html(res, response)
  });

  unsubscribe = RequestHandlerMiddleware.asyncHandler(async (req: VercelRequest, res: VercelResponse): Promise<void> => {
    if (CorsMiddleware.apply(req, res)) return;

    const email = this.getBodyEmail(req);
    const data = await this.setSubscriberEnabledUseCase.execute(email, false);
    const response = await this.renderPageUseUseCase.execute(data, 'page/unsubscribe-success.html')
    ResponseHandlerMiddleware.html(res, response)
  });

  renderPageSubscribe = RequestHandlerMiddleware.asyncHandler(async (req: VercelRequest, res: VercelResponse): Promise<void> => {
    if (CorsMiddleware.apply(req, res)) return;

    const response = await this.renderPageUseUseCase.execute({}, 'page/subscribe.html')
    ResponseHandlerMiddleware.html(res, response)
  });

  renderPageUnSubscribe = RequestHandlerMiddleware.asyncHandler(async (req: VercelRequest, res: VercelResponse): Promise<void> => {
    if (CorsMiddleware.apply(req, res)) return;

    const email = this.getQueryEmail(req);
    const data = { email }
    const response = await this.renderPageUseUseCase.execute(data, 'page/unsubscribe.html')
    ResponseHandlerMiddleware.html(res, response)
  });

  private getQueryEmail(req: VercelRequest): string {
    console.log('req.query', req.query);
    console.log('req.body', req.body);
    
    if (typeof req.query.email === 'string') {
      return req.query.email;
    }

    if (Array.isArray(req.query.email)) {
      return req.query.email[0]
    }

    throw new BusinessError("E-mail is required!");
  }

  private getBodyEmail(req: VercelRequest): string {
    if (typeof req.body.email === 'string') {
      return req.body.email;
    }

    throw new BusinessError("E-mail is required!");
  }
}
