import { Subscriber } from '../../domain/entities/subscriber.entity.js';
import { BusinessError } from '../../domain/errors/BusinessError.js';
import { ISubscriberRepository } from '../../domain/port/databases/subscriber.repository.js';

export class SetSubscriberEnabledUseCase {
  constructor(private readonly subscriberRepository: ISubscriberRepository) {}

  async execute(email: string, enabled: boolean): Promise<Subscriber>  {
    const subscriber = await this.subscriberRepository.getByEmail(email);

    if (!subscriber) {
      throw new BusinessError(`Subscriber with email ${email} not found!`);
    }

    subscriber.updated_at = new Date();
    subscriber.enabled = enabled;

    return this.subscriberRepository.updateByEmail(subscriber, subscriber.email);
  }
}
