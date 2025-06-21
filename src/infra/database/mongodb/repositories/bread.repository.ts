import { MongoRepository } from '../repository.js';
import { BusinessError } from '../../../../domain/errors/BusinessError.js';
import type { Bread } from '../../../../domain/entities/bread.entity.js';
import { BreadMapper } from '../mappers/bread.mapper.js';
import { Logger } from '../../../logger/pino.logger.js'
import type { IBreadRepository } from '../../../../domain/port/databases/bread.repository.js';
import { BreadDocument, BreadModel } from '../schemas/bread.schema.js';
import { BreadType } from '../../../../domain/enums/bread-type.enum.js';

export class BreadMongoDBRepository implements IBreadRepository {
  private breadRepository = new MongoRepository(BreadModel);
  private logger = Logger.getLogger()

  async getByUUID(uuid: string): Promise<Bread | null> {
    try {
      const doc = await this.breadRepository.findOne({ uuid: uuid });
      return doc ? BreadMapper.toEntity(doc) : null;
    } catch (error) {
      this.logger.error(error);
      throw new BusinessError('Error retrieving bread by id from database');
    }
  }

  async create(bread: Bread): Promise<Bread> {
    try {
      let doc = BreadMapper.toDocument(bread);

      if ('_id' in doc) {
        delete (doc as any)._id;
      }

      await this.breadRepository.create(doc as Omit<Partial<BreadDocument>, '_id'>);
      return bread;
    } catch (error) {
      this.logger.error(error);
      throw new BusinessError('Error creating bread in database');
    }
  }

  async updateById(bread: Bread, id: string): Promise<Bread> {
    try {
      const doc = BreadMapper.toDocument(bread);
      await this.breadRepository.update({ _id: id }, doc);
      return bread;
    } catch (error) {
      this.logger.error(error);
      throw new BusinessError('Error updating bread in database');
    }
  }

  async getOrderedByDateDesc(): Promise<Bread[]> {
    try {
      const docs = await this.breadRepository.find({}, { created_at: -1 });

      return docs.map(doc => BreadMapper.toEntity(doc));
    } catch (error) {
      this.logger.error(error);
      throw new BusinessError('Error retrieving bread list from database');
    }
  }

  async getByDateAndType(date: string, type: BreadType): Promise<Bread[]> {
    try {
      const docs = await this.breadRepository.find({ date: date, type: type });
      return docs.map(doc => BreadMapper.toEntity(doc));
    } catch (error) {
      this.logger.error(error);
      throw new BusinessError('Error retrieving bread by date and type from database');
    }
  }
}
