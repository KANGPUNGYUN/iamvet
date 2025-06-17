export interface JobRepository {
  findAll(): Promise<any[]>;
  findById(id: string): Promise<any>;
  create(data: any): Promise<any>;
}