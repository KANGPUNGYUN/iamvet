export class UserService {
  async getUser(id: string) {
    return { id, name: 'User' };
  }
  
  async updateUser(id: string, data: any) {
    return { id, ...data };
  }
}