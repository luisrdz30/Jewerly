import { Pool } from 'pg';
import pool from '../utils/db';
import { Category } from './Category';

export class CategoryModel {
  static async create(category: Omit<Category, 'id' | 'created_at' | 'updated_at'>): Promise<Category> {
    const now = new Date();
    const { name, description, image_url } = category;
    const result = await pool.query(
      'INSERT INTO categories (name, description, image_url, created_at, updated_at) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [name, description, image_url, now, now]
    );
    return result.rows[0];
  }

  static async findAll(): Promise<Category[]> {
    const result = await pool.query('SELECT * FROM categories ORDER BY name');
    return result.rows;
  }

  static async findById(id: number): Promise<Category | null> {
    const result = await pool.query('SELECT * FROM categories WHERE id = $1', [id]);
    if (result.rows.length === 0) {
      return null;
    }
    return result.rows[0];
  }

  static async update(id: number, category: Partial<Omit<Category, 'id' | 'created_at' | 'updated_at'>>): Promise<Category | null> {
    const now = new Date();
    const { name, description, image_url } = category;

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
    if (image_url !== undefined) {
      fields.push(`image_url = $${paramIndex++}`);
      values.push(image_url);
    }

    if (fields.length === 0) {
      // No fields to update
      return await this.findById(id);
    }

    values.push(now); // updated_at
    values.push(id); // id for WHERE clause

    const query = `
      UPDATE categories
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
    const result = await pool.query('DELETE FROM categories WHERE id = $1', [id]);
    return result.rowCount > 0;
  }
}