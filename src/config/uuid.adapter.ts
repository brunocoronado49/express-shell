import { v4 as uuid } from 'uuid';

export class UuidAdapter {
  static v4 = (): string => uuid();
}
