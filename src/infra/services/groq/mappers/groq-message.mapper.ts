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

    // Encontra a primeira linha não vazia para usar como título potencial
    const firstLine =
      raw
      .split('\n')
      .find((line) => line.trim().length > 0)
      ?.trim() ?? '';

    // Remove a formatação markdown do título, tratando os casos '# Título' e '**Título**'
    const title = firstLine.replace(/^#\s*|^\*\*|\*\*$/g, '').trim();

    return {
      title: title,
      text: raw,
    };
  }
}
