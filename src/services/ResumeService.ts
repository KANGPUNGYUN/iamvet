export class ResumeService {
  async getResumes() {
    return [];
  }
  
  async getResume(id: string) {
    return { id, title: 'Resume Title' };
  }
}