import { VercelRequest, VercelResponse } from "@vercel/node";
import { GenerateSendBreadUseCase } from "../../../../application/usecases/generate-send-bread-use-case.js";
import { GetBreadByIdUseCase } from "../../../../application/usecases/get-bread-by-id-use-case.js";
import { GetBreadListUseCase } from "../../../../application/usecases/get-bread-list-use-case.js";
import { RenderPageUseUseCase } from "../../../../application/usecases/render-page-use-case.js";
import { BusinessError } from "../../../../domain/errors/BusinessError.js";
import { CorsMiddleware } from "../middlewares/cors.middleware.js";
import { HttpMethodMiddleware } from "../middlewares/http-method.middleware.js";
import { RequestHandlerMiddleware } from "../middlewares/request-handler.middleware.js";
import { ResponseHandlerMiddleware } from "../middlewares/response-handler.middleware.js";
import { MarkdownUtil } from "../../../../shared/utils/markdown.util.js";
import { BreadType } from "../../../../domain/enums/bread-type.enum.js";

export class BreadRoutes {
  constructor(
    private readonly getBreadListUseCase: GetBreadListUseCase,
    private readonly getBreadByIdUseCase: GetBreadByIdUseCase,
    private readonly generateSendBreadUseCase: GenerateSendBreadUseCase,
    private readonly renderPageUseUseCase: RenderPageUseUseCase,
  ) {}

  getBreads = RequestHandlerMiddleware.asyncHandler(async (req: VercelRequest, res: VercelResponse): Promise<void> => {
    if (CorsMiddleware.apply(req, res)) return;
    if (HttpMethodMiddleware.ensure(req, res, 'GET')) return;

    const data = await this.getBreadListUseCase.execute();
    ResponseHandlerMiddleware.json(res, data)
  });

  getBread = RequestHandlerMiddleware.asyncHandler(async (req: VercelRequest, res: VercelResponse): Promise<void> => {
    if (CorsMiddleware.apply(req, res)) return;
    if (HttpMethodMiddleware.ensure(req, res, 'GET')) return;

    const breadId = this.getQueryId(req);
    const data = await this.getBreadByIdUseCase.execute(breadId);
    ResponseHandlerMiddleware.json(res, data)
  });

  generate = RequestHandlerMiddleware.asyncHandler(async (req: VercelRequest, res: VercelResponse): Promise<void> => {
    if (CorsMiddleware.apply(req, res)) return;
    if (HttpMethodMiddleware.ensure(req, res, 'GET')) return;

    const params = this.getQueryParamsGenerate(req);

    await this.generateSendBreadUseCase.execute(
      params.refresh === 'true',
      params.type as BreadType,
    );

    ResponseHandlerMiddleware.json(res, "OK!")
  });

  renderPageBreads = RequestHandlerMiddleware.asyncHandler(async (req: VercelRequest, res: VercelResponse): Promise<void> => {
    if (CorsMiddleware.apply(req, res)) return;
    if (HttpMethodMiddleware.ensure(req, res, 'GET')) return;

    const data = await this.getBreadListUseCase.execute();
    const response = await this.renderPageUseUseCase.execute({ posts: data }, 'page/posts.html')
    ResponseHandlerMiddleware.html(res, response)
  });

  renderPageBread = RequestHandlerMiddleware.asyncHandler(async (req: VercelRequest, res: VercelResponse): Promise<void> => {
    if (CorsMiddleware.apply(req, res)) return;
    if (HttpMethodMiddleware.ensure(req, res, 'GET')) return;

    const breadId = this.getQueryId(req);
    const data = await this.getBreadByIdUseCase.execute(breadId);
    const textHtml = MarkdownUtil.toHtml(data.message);
    const response = await this.renderPageUseUseCase.execute({
      ...data,
      message: textHtml,
    }, 'page/post.html');
    ResponseHandlerMiddleware.html(res, response)
  });

  private getQueryId(req: VercelRequest): string {
    return this.getQueryParam(req, 'id')!;
  }

  private getQueryParamsGenerate(req: VercelRequest) {
    return {
      refresh: this.getQueryParam(req, 'refresh'),
      type: this.getQueryParam(req, 'type'),
    };
  }

  private getQueryParam(req: VercelRequest, param: string, required: boolean = false): string | undefined {
    const value = req.query[param];

    if (typeof value === 'string') {
      return value;
    }

    if (Array.isArray(value)) {
      return value[0];
    }

    if (required) {
      throw new BusinessError(`${param} is required!`);
    }
  }
}
