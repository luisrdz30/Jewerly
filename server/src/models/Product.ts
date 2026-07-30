export interface Product {
  id: number;
  name: string;
  description?: string;
  price: number;
  material?: string;
  weight_grams?: number;
  dimensions_cm?: string;
  image_url?: string;
  category_id?: number;
  is_featured?: boolean;
  in_stock?: boolean;
  sku?: string;
  created_at: Date;
  updated_at: Date;
}