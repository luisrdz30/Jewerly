export interface Category {
  id: number;
  name: string;
  description?: string;
  image_url?: string;
  created_at: Date;
  updated_at: Date;
}