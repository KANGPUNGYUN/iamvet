export class LectureService {
  async getLectures() {
    return [];
  }
  
  async getLecture(id: string) {
    return { id, title: 'Lecture Title' };
  }
}