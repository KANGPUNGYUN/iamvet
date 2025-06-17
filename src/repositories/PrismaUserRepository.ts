import { UserRepository } from '../interfaces/UserRepository';

export class PrismaUserRepository implements UserRepository {
  async findById(id: string) {
    return { id, name: 'User', email: 'user@example.com' };
  }
  
  async update(id: string, data: any) {
    return { id, ...data };
  }
}