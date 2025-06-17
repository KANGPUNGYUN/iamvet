export interface LectureRepository {
  findAll(): Promise<any[]>;
  findById(id: string): Promise<any>;
}