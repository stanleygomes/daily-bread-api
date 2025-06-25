import { BreadMessage } from '../../domain/entities/bread-message.entity.js';
import { Bread } from '../../domain/entities/bread.entity.js';
import { BreadType } from '../../domain/enums/bread-type.enum.js';
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

    const subject = `🙏 Devocional do dia - ${params.title}`;

    await this.emailService.sendBulkEmails(emailToList, subject, html);
  }

  private getPrompt(type: BreadType): string {
    if (type === BreadType.DEVOTIONAL) {
      return `
        Escolha um versículo da Bíblia que transmita um ensinamento, uma reflexão, uma lei ou um chamado — ou seja, que não seja apenas um trecho preso ao contexto histórico, mas que contenha um princípio atemporal, útil para orientação prática e espiritual profunda.

        A resposta deve estar exatamente no seguinte formato markdown. Exemplo de estrutura do campo text em markdown:

        # Título do Devocional

        ## Hebreus 12:1-2

        > Portanto, também nós, visto que estamos rodeados de tão grande nuvem de testemunhas, deixemos todo o peso e o pecado que tenazmente nos assedia, e corramos com perseverança a corrida que nos está proposta, olhando para Jesus, autor e consumador da fé, o qual, pelo gozo que lhe estava proposto, suportou a cruz, desprezando a vergonha, e assentou-se à direita do trono de Deus.

        **Resumo:**  
        Neste versículo, somos convidados a reconhecer a iminente corrida da vida cristã, onde a perseverança é essencial. A "nuvem de testemunhas" nos inspira e nos fortalece, lembrando que não estamos sozinhos na nossa jornada de fé...

        ### Reflexão Devocional

        - A vida cristã é frequentemente comparada a uma corrida...
        - Tentar viver a vida em nossa própria força...
        - Olhando para Jesus — o "autor e consumador da fé"...
        - A disposição de Jesus em suportar a cruz...
        - À medida que avançamos em nossa jornada...

        ### Oração

        Senhor Deus, te louvo pela grandeza do Teu plano em minha vida.  
        Que eu possa sempre olhar para Jesus, encontrando Nele a força necessária para continuar...

        A reflexão devocional deve ser profunda, com foco em missão, transformação de vida, obediência e chamado. Evite superficialidade ou mensagens genéricas de conforto. Evite enviar a mesma resposta. Tente ser original e relevante para o dia de hoje.

        Apenas responda com o markdown. Não adicione comentários nem explicações fora do markdown.
      `;
    } else if (type === BreadType.STUDY) {
      return `
        Escreva um conteúdo no formato de uma newsletter cristã diária, utilizando a linguagem Markdown.

        O conteúdo deve conter os seguintes blocos, com títulos destacados, emojis moderados e organização visual agradável:

        ✨ Versículo do Dia

        Escolha um versículo significativo (preferencialmente na versão Almeida Revista e Atualizada). Explique seu contexto e como ele pode ser aplicado na vida prática.
        ➤ Traga versículos variados a cada edição, incluindo trechos menos populares da Bíblia, de diferentes livros (Antigo e Novo Testamento), evitando repetições frequentes.

        🙏 Reflexão Devocional

        Um pequeno devocional baseado no versículo do dia, com aplicação prática para a vida cristã.
        ➤ Cada reflexão deve ser única, trazendo novas formas de aplicar a Palavra, mesmo quando o tema parecer familiar.

        📖 Conhecimento Bíblico

        Compartilhe uma curiosidade, explicação ou detalhe sobre algum personagem, lugar, evento ou conceito da Bíblia.
        ➤ Evite repetir os mesmos personagens ou fatos em edições próximas. Dê preferência a conteúdos menos explorados, oferecendo ângulos novos até sobre personagens conhecidos.

        ⛪ História do Cristianismo

        Traga um fato marcante da história da Igreja Cristã, de qualquer época ou região.
        ➤ Varie entre períodos (igreja primitiva, Idade Média, Reforma, século XX…), locais (Oriente, Ocidente, África, Américas) e temas (pessoas, concílios, missões, perseguições, avivamentos). Não se limite a uma vertente ou tradição específica.

        📜 A Lei de Deus

        Apresente um princípio da Lei de Deus ou um mandamento, e mostre sua relevância à luz da graça e da obra de Cristo.
        ➤ Alterne entre os Dez Mandamentos, princípios espirituais da Torá, ética de Jesus nos Evangelhos, e ensinamentos das cartas do Novo Testamento. Mantenha o foco na transformação do coração.

        🙌 Dica de Oração

        Sugira um tema ou direção para a oração do dia. Pode estar relacionado ao conteúdo anterior ou a uma necessidade espiritual pessoal ou coletiva.
        ➤ Varie os temas ao longo dos dias (ex: gratidão, arrependimento, intercessão, cura, sabedoria, perseverança).

        ⸻

        Instruções gerais:

        - Use um tom informal, mas que seja direto, sem girias.
        - Utilize emojis com moderação, apenas nos títulos ou onde for útil.
        - O conteúdo deve ser fiel às Escrituras, centrado em Cristo e teologicamente sólido.
        - Evite repetições entre dias. Priorize variedade e profundidade.
        - A resposta final deve estar formatada inteiramente em Markdown, não adicione comentários nem explicações fora do markdown.
      `;
    } else {
      throw new BusinessError(`Unknown bread type: ${type}`);
    }
  }

  private getImageList() {
    return [
      "https://images.pexels.com/photos/54333/person-clinic-cross-religion-54333.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
      "https://images.pexels.com/photos/257030/pexels-photo-257030.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
      "https://images.pexels.com/photos/1296720/pexels-photo-1296720.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
      "https://images.pexels.com/photos/2258240/pexels-photo-2258240.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
      "https://images.pexels.com/photos/2014775/pexels-photo-2014775.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
      "https://images.pexels.com/photos/460395/pexels-photo-460395.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
      "https://images.pexels.com/photos/70847/cross-sunset-sunrise-hill-70847.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
      "https://images.pexels.com/photos/2752461/pexels-photo-2752461.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
      "https://images.pexels.com/photos/977659/pexels-photo-977659.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
      "https://images.pexels.com/photos/250609/pexels-photo-250609.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
      "https://images.pexels.com/photos/8383656/pexels-photo-8383656.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
      "https://images.pexels.com/photos/8383459/pexels-photo-8383459.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
      "https://images.pexels.com/photos/8383491/pexels-photo-8383491.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
      "https://images.pexels.com/photos/8384036/pexels-photo-8384036.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
      "https://images.pexels.com/photos/8383664/pexels-photo-8383664.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
      "https://images.pexels.com/photos/10506690/pexels-photo-10506690.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
      "https://images.pexels.com/photos/8383416/pexels-photo-8383416.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
      "https://images.pexels.com/photos/5199800/pexels-photo-5199800.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
      "https://images.pexels.com/photos/1112048/pexels-photo-1112048.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
      "https://images.pexels.com/photos/12812920/pexels-photo-12812920.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
      "https://images.pexels.com/photos/15203126/pexels-photo-15203126/free-photo-of-photo-of-an-open-bible-on-the-grass.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
      "https://images.pexels.com/photos/29756408/pexels-photo-29756408/free-photo-of-open-bible-with-blurred-christmas-lights-in-background.png?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
      "https://images.pexels.com/photos/8735586/pexels-photo-8735586.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
      "https://images.pexels.com/photos/23021429/pexels-photo-23021429/free-photo-of-top-view-of-the-bible-in-mandarin.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
      "https://images.pexels.com/photos/23021431/pexels-photo-23021431/free-photo-of-the-word-pray-made-from-wooden-letter-tiles.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
      "https://images.pexels.com/photos/6860402/pexels-photo-6860402.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
      "https://images.pexels.com/photos/15382608/pexels-photo-15382608/free-photo-of-an-opened-bible-with-a-stick-with-thorns-lying-on-a-wooden-background.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
      "https://images.pexels.com/photos/7356461/pexels-photo-7356461.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
    ]
  }
}
