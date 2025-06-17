import { LectureRepository } from '../interfaces/LectureRepository';

export class PrismaLectureRepository implements LectureRepository {
  async findAll() {
    return [];
  }
  
  async findById(id: string) {
    return { id, title: 'Lecture Title' };
  }
}