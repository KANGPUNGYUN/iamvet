export interface MessageRepository {
  findAll(): Promise<any[]>;
  findById(id: string): Promise<any>;
}