export class ApplicationService {
  async getApplications() {
    return [];
  }
  
  async createApplication(data: any) {
    return { id: '1', ...data };
  }
}