export interface IAIQueryService {
  fetchText(prompt: string): Promise<string>;
}
