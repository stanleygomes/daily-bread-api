import { BreadMessage } from '../../../../domain/entities/bread-message.entity.js';
import { AimlapiMessageResponse } from '../responses/aimlapi-message.response.js';

export class BreadMessageMapper {
  static toEntity(response: AimlapiMessageResponse): BreadMessage {
    return {
      title: response.title,
      text: response.text,
    };
  }

  static toDocument(entity: BreadMessage): Partial<AimlapiMessageResponse> {
    return {
      title: entity.title,
      text: entity.text,
    };
  }
}
