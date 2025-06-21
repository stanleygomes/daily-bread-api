import { Bread } from '../../domain/entities/bread.entity.js';
import { BusinessError } from '../../domain/errors/BusinessError.js';
import { IBreadRepository } from '../../domain/port/databases/bread.repository.js';

export class GetBreadListUseCase {
  constructor(private readonly breadRepository: IBreadRepository) {}

  async execute(): Promise<Bread[]>  {
    const breads = await this.breadRepository.getOrderedByDateDesc();

    if (!breads) {
      throw new BusinessError(`Breads is empty!`);
    }

    return breads.map(bread => {
      return {
        ...bread,
        ...{
          link: `/api/breads/${bread.uuid}`,
        }
    }});
  }
}
