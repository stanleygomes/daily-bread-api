import { BreadMessage } from "../../entities/bread-message.entity.js";

export interface IAIQueryService {
  fetchText(prompt: string): Promise<BreadMessage>;
}
