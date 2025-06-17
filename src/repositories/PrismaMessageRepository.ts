import { MessageRepository } from '../interfaces/MessageRepository';

export class PrismaMessageRepository implements MessageRepository {
  async findAll() {
    return [];
  }
  
  async findById(id: string) {
    return { id, content: 'Message content' };
  }
}