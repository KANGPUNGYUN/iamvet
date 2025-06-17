export interface ApplicationRepository {
  findAll(): Promise<any[]>;
  create(data: any): Promise<any>;
}