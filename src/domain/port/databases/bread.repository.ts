import { Bread } from '../../entities/bread.entity.js';

export interface IBreadRepository {
  getByUUID(id: string): Promise<Bread | null>;
  create(bread: Bread): Promise<Bread>;
  updateById(bread: Bread, id: string): Promise<Bread>;
  getByUUIDOrderedByDate(): Promise<Bread[]>;
  getByDate(date: string): Promise<Bread[]>;
}
