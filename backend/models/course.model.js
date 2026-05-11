import { query } from '../config/database.js';

export const createCourse = async (courseData) => {
  const {
    title, slug, description, difficulty, category, instructor_id, thumbnail_url,
    duration_hours, learning_outcomes, prerequisites, is_premium, price
  } = courseData;

  const result = await query(
    `INSERT INTO courses (title, slug, description, difficulty, category, instructor_id,
      thumbnail_url, duration_hours, learning_outcomes, prerequisites, is_premium, price)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
     RETURNING *`,
    [title, slug, description, difficulty, category, instructor_id, thumbnail_url,
      duration_hours, learning_outcomes, prerequisites, is_premium, price]
  );

  return result.rows[0];
};

export const getCourseBySlug = async (slug) => {
  const result = await query('SELECT * FROM courses WHERE slug = $1', [slug]);
  return result.rows[0];
};

export const getAllCourses = async (filters = {}) => {
  let queryStr = 'SELECT * FROM courses WHERE is_published = true';
  const values = [];

  if (filters.difficulty) {
    queryStr += ` AND difficulty = $${values.length + 1}`;
    values.push(filters.difficulty);
  }

  if (filters.category) {
    queryStr += ` AND category = $${values.length + 1}`;
    values.push(filters.category);
  }

  queryStr += ' ORDER BY created_at DESC LIMIT $' + (values.length + 1) + ' OFFSET $' + (values.length + 2);
  values.push(filters.limit || 20, filters.offset || 0);

  const result = await query(queryStr, values);
  return result.rows;
};

export const getCourseById = async (id) => {
  const result = await query('SELECT * FROM courses WHERE id = $1', [id]);
  return result.rows[0];
};

export const updateCourse = async (id, updateData) => {
  const fields = [];
  const values = [id];
  let paramCount = 2;

  Object.entries(updateData).forEach(([key, value]) => {
    fields.push(`${key} = $${paramCount}`);
    values.push(value);
    paramCount++;
  });

  const result = await query(
    `UPDATE courses SET ${fields.join(', ')}, updated_at = CURRENT_TIMESTAMP
     WHERE id = $1 RETURNING *`,
    values
  );

  return result.rows[0];
};

export const publishCourse = async (id) => {
  return updateCourse(id, { is_published: true });
};
