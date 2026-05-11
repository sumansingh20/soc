import bcryptjs from 'bcryptjs';
import { query } from '../config/database.js';
import logger from '../utils/logger.js';

export const createUser = async (userData) => {
  const { email, username, password, fullName, role = 'student' } = userData;

  const hashedPassword = await bcryptjs.hash(password, 10);

  const result = await query(
    `INSERT INTO users (email, username, password_hash, full_name, role)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING id, email, username, full_name, role, created_at`,
    [email, username, hashedPassword, fullName, role]
  );

  return result.rows[0];
};

export const getUserByEmail = async (email) => {
  const result = await query('SELECT * FROM users WHERE email = $1', [email]);
  return result.rows[0];
};

export const getUserById = async (id) => {
  const result = await query('SELECT * FROM users WHERE id = $1', [id]);
  return result.rows[0];
};

export const updateUser = async (id, updateData) => {
  const fields = [];
  const values = [id];
  let paramCount = 2;

  Object.entries(updateData).forEach(([key, value]) => {
    fields.push(`${key} = $${paramCount}`);
    values.push(value);
    paramCount++;
  });

  const result = await query(
    `UPDATE users SET ${fields.join(', ')}, updated_at = CURRENT_TIMESTAMP
     WHERE id = $1 RETURNING *`,
    values
  );

  return result.rows[0];
};

export const verifyPassword = async (password, hashedPassword) => {
  return bcryptjs.compare(password, hashedPassword);
};
