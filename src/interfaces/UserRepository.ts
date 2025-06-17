export interface UserRepository {
  findById(id: string): Promise<any>;
  update(id: string, data: any): Promise<any>;
}