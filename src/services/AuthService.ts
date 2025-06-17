export class AuthService {
  async login(email: string, password: string) {
    return { token: 'jwt-token' };
  }
  
  async register(data: any) {
    return { user: data };
  }
}