import { TransferRepository } from '../interfaces/TransferRepository';

export class PrismaTransferRepository implements TransferRepository {
  async findAll() {
    return [];
  }
  
  async findById(id: string) {
    return { id, title: 'Transfer Title' };
  }
  
  async create(data: any) {
    return { id: '1', ...data };
  }
}