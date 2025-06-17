import { JobRepository } from '../interfaces/JobRepository';

export class PrismaJobRepository implements JobRepository {
  async findAll() {
    return [];
  }
  
  async findById(id: string) {
    return { id, title: 'Job Title' };
  }
  
  async create(data: any) {
    return { id: '1', ...data };
  }
}