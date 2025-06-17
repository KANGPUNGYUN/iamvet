import { ApplicationRepository } from '../interfaces/ApplicationRepository';

export class PrismaApplicationRepository implements ApplicationRepository {
  async findAll() {
    return [];
  }
  
  async create(data: any) {
    return { id: '1', ...data };
  }
}