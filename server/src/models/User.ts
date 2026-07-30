export interface User {
  id: number;
  email: string;
  password: string;
  role: 'buyer' | 'seller' | 'admin';
  created_at: Date;
  updated_at: Date;
}