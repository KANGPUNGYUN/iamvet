export class JobService {
  async getJobs() {
    return [];
  }
  
  async getJob(id: string) {
    return { id, title: 'Job Title' };
  }
}