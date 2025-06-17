export interface AuthRepository {
  login(email: string, password: string): Promise<any>;
  register(data: any): Promise<any>;
  logout(): Promise<void>;
}