import { BreadMessage } from '../../../../domain/entities/bread-message.entity.js';
import { GroqChatCompletionResponse } from '../responses/groq-message.response.js';

export class GroqChatCompletionMessageMapper {
  static toEntity(response: GroqChatCompletionResponse): BreadMessage {
    const content = this.parseResponse(response);

    return {
      title: content.title,
      text: content.text,
    };
  }

  // private static parseResponse(response: GroqChatCompletionResponse): BreadMessage {
  //   let raw = response.choices?.[0]?.message?.content ?? '';
  //   const match = raw.match(/\{[\s\S]*\}/);

  //   if (match) {
  //     raw = match[0];
  //   }

  //   return JSON.parse(raw) as BreadMessage;
  // }

  private static parseResponse(response: GroqChatCompletionResponse): BreadMessage {
    const raw = response.choices?.[0]?.message?.content ?? '';
    const firstLine = raw
      .split('\n')
      .find(line => line.trim().length > 0)
      ?.replace(/^#\s*/, '')
      .trim();

    return {
      title: firstLine!,
      text: raw,
    };
  }
}
