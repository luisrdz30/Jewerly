import { Pool } from 'pg';
import pool from '../utils/db';
import { Product } from './Product';

export class ProductModel {
  static async create(product: Omit<Product, 'id' | 'created_at' | 'updated_at'>): Promise<Product> {
    const now = new Date();
    const {
      name,
      description,
      price,
      material,
      weight_grams,
      dimensions_cm,
      image_url,
      category_id,
      is_featured,
      in_stock,
      sku
    } = product;

    const result = await pool.query(
      `INSERT INTO products
       (name, description, price, material, weight_grams, dimensions_cm, image_url, category_id, is_featured, in_stock, sku, created_at, updated_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
       RETURNING *`,
      [
        name,
        description,
        price,
        material,
        weight_grams,
        dimensions_cm,
        image_url,
        category_id,
        is_featured ?? false,
        in_stock ?? true,
        sku,
        now,
        now
      ]
    );
    return result.rows[0];
  }

  static async findAll(): Promise<Product[]> {
    const result = await pool.query('SELECT * FROM products ORDER BY created_at DESC');
    return result.rows;
  }

  static async findById(id: number): Promise<Product | null> {
    const result = await pool.query('SELECT * FROM products WHERE id = $1', [id]);
    if (result.rows.length === 0) {
      return null;
    }
    return result.rows[0];
  }

  static async findByCategory(categoryId: number): Promise<Product[]> {
    const result = await pool.query('SELECT * FROM products WHERE category_id = $1 ORDER BY created_at DESC', [categoryId]);
    return result.rows;
  }

  static async findFeatured(): Promise<Product[]> {
    const result = await pool.query('SELECT * FROM products WHERE is_featured = true ORDER BY created_at DESC');
    return result.rows;
  }

  static async update(id: number, product: Partial<Omit<Product, 'id' | 'created_at' | 'updated_at'>>): Promise<Product | null> {
    const now = new Date();
    const {
      name,
      description,
      price,
      material,
      weight_grams,
      dimensions_cm,
      image_url,
      category_id,
      is_featured,
      in_stock,
      sku
    } = product;

    // Build dynamic query
    const fields = [];
    const values = [];
    let paramIndex = 1;

    if (name !== undefined) {
      fields.push(`name = $${paramIndex++}`);
      values.push(name);
    }
    if (description !== undefined) {
      fields.push(`description = $${paramIndex++}`);
      values.push(description);
    }
    if (price !== undefined) {
      fields.push(`price = $${paramIndex++}`);
      values.push(price);
    }
    if (material !== undefined) {
      fields.push(`material = $${paramIndex++}`);
      values.push(material);
    }
    if (weight_grams !== undefined) {
      fields.push(`weight_grams = $${paramIndex++}`);
      values.push(weight_grams);
    }
    if (dimensions_cm !== undefined) {
      fields.push(`dimensions_cm = $${paramIndex++}`);
      values.push(dimensions_cm);
    }
    if (image_url !== undefined) {
      fields.push(`image_url = $${paramIndex++}`);
      values.push(image_url);
    }
    if (category_id !== undefined) {
      fields.push(`category_id = $${paramIndex++}`);
      values.push(category_id);
    }
    if (is_featured !== undefined) {
      fields.push(`is_featured = $${paramIndex++}`);
      values.push(is_featured);
    }
    if (in_stock !== undefined) {
      fields.push(`in_stock = $${paramIndex++}`);
      values.push(in_stock);
    }
    if (sku !== undefined) {
      fields.push(`sku = $${paramIndex++}`);
      values.push(sku);
    }

    if (fields.length === 0) {
      return await this.findById(id);
    }

    values.push(now); // updated_at
    values.push(id); // id for WHERE clause

    const query = `
      UPDATE products
      SET ${fields.join(', ')}, updated_at = $${paramIndex}
      WHERE id = $${paramIndex + 1}
      RETURNING *
    `;

    const result = await pool.query(query, values);
    if (result.rows.length === 0) {
      return null;
    }
    return result.rows[0];
  }

  static async delete(id: number): Promise<boolean> {
    const result = await pool.query('DELETE FROM products WHERE id = $1', [id]);
    return result.rowCount > 0;
  }

  // Search products by name or description
  static async search(query: string): Promise<Product[]> {
    const searchTerm = `%${query}%`;
    const result = await pool.query(
      'SELECT * FROM products WHERE (name ILIKE $1 OR description ILIKE $1) ORDER BY created_at DESC',
      [searchTerm]
    );
    return result.rows;
  }
}