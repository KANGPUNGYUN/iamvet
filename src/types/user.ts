export interface User {
  id: string;
  email: string;
  name: string;
  type: 'veterinarian' | 'hospital';
}