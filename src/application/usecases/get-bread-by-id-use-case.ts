import { Bread } from '../../domain/entities/bread.entity.js';
import { BusinessError } from '../../domain/errors/BusinessError.js';
import { IBreadRepository } from '../../domain/port/databases/bread.repository.js';

export class GetBreadByIdUseCase {
  constructor(private readonly breadRepository: IBreadRepository) {}

  async execute(uuid: string): Promise<Bread>  {
    const bread = await this.breadRepository.getByUUID(uuid);

    if (!bread) {
      throw new BusinessError(`Bread with id ${uuid} not found!`);
    }

    return bread;
  }
}
