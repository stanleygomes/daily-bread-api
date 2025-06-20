import { GenerateSendBreadUseCase } from '../../application/usecases/generate-send-bread-use-case.js';
import { GetBreadByIdUseCase } from '../../application/usecases/get-bread-by-id-use-case.js';
import { GetBreadListUseCase } from '../../application/usecases/get-bread-list-use-case.js';
import { RenderPageUseUseCase } from '../../application/usecases/render-page-use-case.js';
import { SetSubscriberEnabledUseCase } from '../../application/usecases/set-subscriber-enabled-use-case.js';
import { connectMongoose } from '../database/mongodb/connection.js';
import { BreadMongoDBRepository } from '../database/mongodb/repositories/bread.repository.js';
import { SubscriberMongoDBRepository } from '../database/mongodb/repositories/subscriber.repository.js';
import { AiMlApiService } from '../services/ai-mlapi/ai-mlapi.service.js';
import { ResendService } from '../services/resend/resend.service.js';
import { BreadRoutes } from '../web/vercel/routes/bread.route.js';
import { SubscriptionRoutes } from '../web/vercel/routes/subscription.route.js';

await connectMongoose();

/* repositories */
const breadRepository = new BreadMongoDBRepository();
const subscriberRepository = new SubscriberMongoDBRepository();

/* services */
const emailService = new ResendService();
const aIQueryService = new AiMlApiService();

/* use cases */
const getBreadListUseCase = new GetBreadListUseCase(
  breadRepository,
);
const getBreadByIdUseCase = new GetBreadByIdUseCase(
  breadRepository,
);
const generateSendBreadUseCase = new GenerateSendBreadUseCase(
  breadRepository,
  subscriberRepository,
  emailService,
  aIQueryService,
);
const renderPageUseUseCase = new RenderPageUseUseCase();
const setSubscriberEnabledUseCase = new SetSubscriberEnabledUseCase(
  subscriberRepository,
);

/* routes */
const breadRoutes = new BreadRoutes(
  getBreadListUseCase,
  getBreadByIdUseCase,
  generateSendBreadUseCase,
  renderPageUseUseCase,
);
const subscriptionRoutes = new SubscriptionRoutes(
  setSubscriberEnabledUseCase,
  renderPageUseUseCase,
);

export {
  breadRoutes,
  subscriptionRoutes
};
