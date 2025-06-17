export interface ResumeRepository {
  findAll(): Promise<any[]>;
  findById(id: string): Promise<any>;
}