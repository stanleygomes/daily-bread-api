import { Subscriber } from '../../domain/entities/subscriber.entity.js';
import { BusinessError } from '../../domain/errors/BusinessError.js';
import { ISubscriberRepository } from '../../domain/port/databases/subscriber.repository.js';
import { UUID } from '../../shared/utils/uuid.js';

export class SetSubscriberEnabledUseCase {
  constructor(private readonly subscriberRepository: ISubscriberRepository) {}

  async execute(email: string, enabled: boolean): Promise<Subscriber>  {
    let subscriber = await this.subscriberRepository.getByEmail(email);

    if (!subscriber) {
      return this.createSubscriber(email, enabled);
    }

    return this.updateSubscriber(subscriber, enabled);
  }

  private createSubscriber(email: string, enabled: boolean): Promise<Subscriber> {
    const uuid = UUID.random();

    return this.subscriberRepository.create({
      uuid,
      email,
      enabled,
      created_at: new Date(),
      updated_at: new Date(),
    });
  }

  private updateSubscriber(subscriber: Subscriber, enabled: boolean): Promise<Subscriber> {
    subscriber.enabled = enabled;
    subscriber.updated_at = new Date();

    return this.subscriberRepository.updateByEmail(subscriber, subscriber.email);
  }
}
