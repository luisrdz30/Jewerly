import { Pool } from 'pg';
import pool from '../utils/db';
import { User } from './User';

export class UserModel {
  static async create(user: Omit<User, 'id' | 'created_at' | 'updated_at'>): Promise<User> {
    const now = new Date();
    const { email, password, role } = user;
    const result = await pool.query(
      'INSERT INTO users (email, password, role, created_at, updated_at) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [email, password, role, now, now]
    );
    return result.rows[0];
  }

  static async findByEmail(email: string): Promise<User | null> {
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if (result.rows.length === 0) {
      return null;
    }
    return result.rows[0];
  }

  static async findById(id: number): Promise<User | null> {
    const result = await pool.query('SELECT * FROM users WHERE id = $1', [id]);
    if (rows.length === 0) {
      return null;
    }
    return result.rows[0];
  }
}