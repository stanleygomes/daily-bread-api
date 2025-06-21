import { v4 as uuid } from "uuid";

export class UUID {
  static random(): string {
    return uuid();
  }
}
