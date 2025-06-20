import { MongoRepository } from '../repository.js';
import { BusinessError } from '../../../../domain/errors/BusinessError.js';
import type { Subscriber } from '../../../../domain/entities/subscriber.entity.js';
import { SubscriberMapper } from '../mappers/subscriber.mapper.js';
import { Logger } from '../../../logger/pino.logger.js'
import type { ISubscriberRepository } from '../../../../domain/port/databases/subscriber.repository.js';
import { SubscriberDocument, SubscriberModel } from '../schemas/subscriber.schema.js';

export class SubscriberMongoDBRepository implements ISubscriberRepository {
  private subscriberRepository = new MongoRepository(SubscriberModel);
  private logger = Logger.getLogger()

  async getByUUID(uuid: string): Promise<Subscriber | null> {
    try {
      const doc = await this.subscriberRepository.findOne({ uuid })

      return doc ? SubscriberMapper.toEntity(doc) : null;
    } catch (error) {
      this.logger.error(error);
      throw new BusinessError('Error retrieving subscriber by uuid from database');
    }
  }

  async getByEmail(email: string): Promise<Subscriber | null> {
    try {
      const doc = await this.subscriberRepository.findOne({ email })

      return doc ? SubscriberMapper.toEntity(doc) : null;
    } catch (error) {
      this.logger.error(error);
      throw new BusinessError('Error retrieving subscriber by email from database');
    }
  }

  async create(subscriber: Subscriber): Promise<Subscriber> {
    try {
      let doc = SubscriberMapper.toDocument(subscriber);

      if ('_id' in doc) {
        delete (doc as any)._id;
      }

      await this.subscriberRepository.create(doc as Omit<Partial<SubscriberDocument>, '_id'>);
      return subscriber;
    } catch (error) {
      this.logger.error(error);
      throw new BusinessError('Error creating subscriber to database');
    }
  }

  async updateByEmail(subscriber: Subscriber, email: string): Promise<Subscriber> {
    try {
      const doc = SubscriberMapper.toDocument(subscriber);
      await this.subscriberRepository.update({ email }, doc);
      return subscriber;
    } catch (error) {
      this.logger.error(error);
      throw new BusinessError('Error updating subscriber to database');
    }
  }

  async getAllByEnabled(enabled: boolean): Promise<Subscriber[]> {
    try {
      const docs = await this.subscriberRepository.find({ enabled: enabled });
      return docs.map(doc => SubscriberMapper.toEntity(doc));
    } catch (error) {
      this.logger.error(error);
      throw new BusinessError('Error retrieving subscriber by email from database');
    }
  }
}
