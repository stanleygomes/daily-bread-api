import { Bread } from '../../entities/bread.entity.js';
import { BreadType } from '../../enums/bread-type.enum.js';

export interface IBreadRepository {
  getByUUID(id: string): Promise<Bread | null>;
  create(bread: Bread): Promise<Bread>;
  updateById(bread: Bread, id: string): Promise<Bread>;
  getOrderedByDateDesc(): Promise<Bread[]>;
  getByDateAndType(date: string, type: BreadType): Promise<Bread[]>;
}
