import { Bread } from '../../domain/entities/bread.entity.js';
import { BusinessError } from '../../domain/errors/BusinessError.js';
import { IBreadRepository } from '../../domain/port/databases/bread.repository.js';
import { ISubscriberRepository } from '../../domain/port/databases/subscriber.repository.js';
import { IAIQueryService } from '../../domain/port/services/ai-query.service.js';
import { IEmailService } from '../../domain/port/services/email.service.js';
import { Logger } from '../../infra/logger/pino.logger.js';
import imageList from '../../shared/assets/image-list.json' with { type: "json" };
import { DateFormat } from '../../shared/utils/date-format.js';
import { TemplateRenderer } from '../../shared/utils/template-renderer.js';

export class GenerateSendBreadUseCase {
  private logger = Logger.getLogger();

  constructor(
    private readonly breadRepository: IBreadRepository,
    private readonly subscriberRepository: ISubscriberRepository,
    private readonly emailService: IEmailService,
    private readonly aIQueryService: IAIQueryService,
  ) {}

  async execute(refresh = false) {
    let emailParams: Bread;

    const bread = await this.getBread();
    if (!bread || refresh === true) {
      emailParams = await this.createBread();
    } else {
      emailParams = bread;
    }

    await this.sendEmail(emailParams);
  }

  private async getBread(): Promise<Bread> {
    const today = DateFormat.getCurrentDate();
    const bread = await this.breadRepository.getByDate(today)
    const count = bread.length;

    return bread[count - 1];
  }

  private async createBread(): Promise<Bread> {
    const image = this.getImage();
    const today = DateFormat.getCurrentDate();
    const now = new Date();
    const prompt = this.getPrompt();
    const message = this.getMessage(prompt);
    const breadToCreate = {
      message: message,
      date: today,
      created_at: now,
      image: image,
    };

    await this.breadRepository.create(breadToCreate);

    return breadToCreate;
  }

  private async getMessage(prompt: string) {
    const message = await this.aIQueryService.fetchText(prompt);
    return JSON.parse(message);
  }

  private getImage() {
    const { images } = imageList;

    if (!images || images.length === 0) {
      this.logger.error("Lista de imagens vazia ou inválida.");
      throw new BusinessError("Lista de imagens vazia ou inválida.");
    }

    const randomIndex = Math.floor(Math.random() * images.length);
    return images[randomIndex];
  }

  private async sendEmail(params: Bread) {
    const subscribers = await this.subscriberRepository.getAllEnabled(true)
    const emailToList = subscribers.map(subscriber => subscriber.email);

    const html = TemplateRenderer.renderHtml(params, 'email/daily.html');
    const subject = `🙏 Devocional do dia - ${params.message.title}`;

    await this.emailService.sendBulkEmails(emailToList, subject, html);
  }

  private getPrompt() {
    return `
Escolha um versículo da Bíblia que transmita um ensinamento, uma reflexão, uma lei ou um chamado — ou seja, que não seja apenas um trecho preso ao contexto histórico, mas que contenha um princípio atemporal, útil para orientação prática e espiritual profunda.

A resposta deve estar no seguinte formato JSON:

{
  "title": "Título forte e marcante do devocional",
  "verse": "Texto do versículo completo com referência",
  "summary": "Resumo de 1 parágrafo explicando o sentido e o significado do versículo",
  "devotional": [
    "Parágrafo 1 da reflexão devocional profunda",
    "Parágrafo 2...",
    "Parágrafo 3...",
    "Parágrafo 4...",
    "Parágrafo 5..."
  ],
  "prayer": [
    "Parágrafo 1 da oração",
    "Parágrafo 2 da oração"
  ]
}

A reflexão devocional deve ser profunda, com foco em missão, transformação de vida, obediência e chamado. Evite superficialidade ou mensagens genéricas de conforto.

Apenas responda com o objeto JSON. Não adicione comentários nem explicações fora do JSON.
    `;
  }
}
