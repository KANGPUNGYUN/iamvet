export interface HospitalRepository {
  findAll(): Promise<any[]>;
  findById(id: string): Promise<any>;
}