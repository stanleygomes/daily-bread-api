import { Bread } from '../../../../domain/entities/bread.entity.js';
import type { BreadDocument } from '../schemas/bread.schema.js';

export class BreadMapper {
  static toEntity(doc: BreadDocument): Bread {
    return {
      _id: doc._id?.toString(),
      uuid: doc.uuid,
      title: doc.title,
      type: doc.type,
      message: doc.message,
      date: doc.date,
      created_at: doc.created_at,
      image: doc.image,
    };
  }

  static toDocument(entity: Bread): Partial<BreadDocument> {
    return {
      title: entity.title,
      uuid: entity.uuid,
      type: entity.type,
      message: entity.message,
      date: entity.date,
      created_at: entity.created_at,
      image: entity.image,
    };
  }
}
