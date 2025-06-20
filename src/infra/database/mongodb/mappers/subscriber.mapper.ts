import { Subscriber } from '../../../../domain/entities/subscriber.entity.js';
import type { SubscriberDocument } from '../schemas/subscriber.schema.js';

export class SubscriberMapper {
  static toEntity(doc: SubscriberDocument): Subscriber {
    return {
      uuid: doc.uuid,
      email: doc.email,
      enabled: doc.enabled,
      created_at: doc.created_at,
      updated_at: doc.updated_at,
    };
  }

  static toDocument(entity: Subscriber): Partial<SubscriberDocument> {
    return {
      uuid: entity.uuid,
      email: entity.email,
      enabled: entity.enabled,
      created_at: entity.created_at,
      updated_at: entity.updated_at,
    };
  }
}
