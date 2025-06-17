import { HospitalRepository } from '../interfaces/HospitalRepository';

export class PrismaHospitalRepository implements HospitalRepository {
  async findAll() {
    return [];
  }
  
  async findById(id: string) {
    return { id, name: 'Hospital Name' };
  }
}