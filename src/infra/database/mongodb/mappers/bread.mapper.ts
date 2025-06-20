import { Bread } from '../../../../domain/entities/bread.entity.js';
import type { BreadDocument } from '../schemas/bread.schema.js';

export class BreadMapper {
  static toEntity(doc: BreadDocument): Bread {
    return {
      _id: doc._id?.toString(),
      title: doc.title,
      verse: doc.verse,
      summary: doc.summary,
      devotional: doc.devotional,
      prayer: doc.prayer,
      date: doc.date,
      created_at: doc.created_at,
      image: doc.image,
    };
  }

  static toDocument(entity: Bread): Partial<BreadDocument> {
    return {
      title: entity.title,
      verse: entity.verse,
      summary: entity.summary,
      devotional: entity.devotional,
      prayer: entity.prayer,
      date: entity.date,
      created_at: entity.created_at,
      image: entity.image,
    };
  }
}
