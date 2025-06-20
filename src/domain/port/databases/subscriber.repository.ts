import { Subscriber } from '../../entities/subscriber.entity.js';

export interface ISubscriberRepository {
  getByUUID(uuid: string): Promise<Subscriber | null>;
  getByEmail(email: string): Promise<Subscriber | null>;
  create(subscriber: Subscriber): Promise<Subscriber>;
  updateByEmail(subscriber: Subscriber, email: string): Promise<Subscriber>;
  getAllByEnabled(enabled: boolean): Promise<Subscriber[]>;
}
