import { BreadMessage } from '../../domain/entities/bread-message.entity.js';
import { Bread } from '../../domain/entities/bread.entity.js';
import { BreadType } from '../../domain/enums/bread-type.enum.js';
import { getBreadPrompt } from '../config/bread-prompts.js';
import { breadImageList } from '../config/image-list.js';
import { BusinessError } from '../../domain/errors/BusinessError.js';
import { IBreadRepository } from '../../domain/port/databases/bread.repository.js';
import { ISubscriberRepository } from '../../domain/port/databases/subscriber.repository.js';
import { IAIQueryService } from '../../domain/port/services/ai-query.service.js';
import { IEmailService } from '../../domain/port/services/email.service.js';
import { Logger } from '../../infra/logger/pino.logger.js';
import { DateFormat } from '../../shared/utils/date-format.util.js';
import { MarkdownUtil } from '../../shared/utils/markdown.util.js';
import { TemplateRenderer } from '../../shared/utils/template-renderer.util.js';
import { UUID } from '../../shared/utils/uuid.util.js';

export class GenerateSendBreadUseCase {
  private logger = Logger.getLogger();

  constructor(
    private readonly breadRepository: IBreadRepository,
    private readonly subscriberRepository: ISubscriberRepository,
    private readonly emailService: IEmailService,
    private readonly aIQueryService: IAIQueryService,
  ) {}

  async execute(refresh = false, type: BreadType = BreadType.DEVOTIONAL): Promise<void> {
    let emailParams: Bread;

    const bread = await this.getBread(type);

    if (!bread || refresh === true) {
      emailParams = await this.createBread(type);
    } else {
      emailParams = bread;
    }

    await this.sendEmail(emailParams);
  }

  private async getBread(type: BreadType): Promise<Bread> {
    const today = DateFormat.getCurrentDate();
    const bread = await this.breadRepository.getByDateAndType(today, type)
    const count = bread.length;

    return bread[count - 1];
  }

  private async createBread(type: BreadType): Promise<Bread> {
    const image = this.getImage();
    const today = DateFormat.getCurrentDate();
    const now = new Date();
    const prompt = this.getPrompt(type);
    const message = await this.getMessage(prompt);
    const breadToCreate = {
      uuid: UUID.random(),
      title: message.title,
      type: type,
      message: message.text,
      date: today,
      created_at: now,
      image: image,
    } as Bread;

    await this.breadRepository.create(breadToCreate);

    return breadToCreate;
  }

  private async getMessage(prompt: string): Promise<BreadMessage> {
    const breadMessage = await this.aIQueryService.fetchText(prompt);
    return breadMessage;
  }

  private getImage() {
    const images = this.getImageList();

    if (!images || images.length === 0) {
      this.logger.error("Lista de imagens vazia ou inválida.");
      throw new BusinessError("Lista de imagens vazia ou inválida.");
    }

    const randomIndex = Math.floor(Math.random() * images.length);
    return images[randomIndex];
  }

  private async sendEmail(params: Bread) {
    const subscribers = await this.subscriberRepository.getAllByEnabled(true)
    const emailToList = subscribers.map(subscriber => subscriber.email);

    const html = TemplateRenderer.renderHtml({
      ...params,
      message: MarkdownUtil.toHtml(params.message),
    }, 'email/daily.html');

    const subject = params.title;

    await this.emailService.sendBulkEmails(emailToList, subject, html);
  }

  private getPrompt(type: BreadType): string {
    try {
      return getBreadPrompt(type);
    } catch (e) {
      throw new BusinessError(`Unknown bread type: ${type}`);
    }
  }

  private getImageList() {
    return breadImageList;
  }
}
