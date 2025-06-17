export interface TransferRepository {
  findAll(): Promise<any[]>;
  findById(id: string): Promise<any>;
  create(data: any): Promise<any>;
}