import { ResumeRepository } from '../interfaces/ResumeRepository';

export class PrismaResumeRepository implements ResumeRepository {
  async findAll() {
    return [];
  }
  
  async findById(id: string) {
    return { id, title: 'Resume Title' };
  }
}