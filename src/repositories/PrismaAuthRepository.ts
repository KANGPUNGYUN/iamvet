import { AuthRepository } from '../interfaces/AuthRepository';

export class PrismaAuthRepository implements AuthRepository {
  async login(email: string, password: string) {
    return { id: '1', email, name: 'User' };
  }
  
  async register(data: any) {
    return { id: '1', ...data };
  }
  
  async logout() {
    return;
  }
}