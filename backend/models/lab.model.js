import { query } from '../config/database.js';

export const createLab = async (labData) => {
  const {
    title, slug, description, objectives, scenario, difficulty, category,
    tags, estimated_time_minutes, instructions, expected_findings
  } = labData;

  const result = await query(
    `INSERT INTO labs (title, slug, description, objectives, scenario, difficulty,
      category, tags, estimated_time_minutes, instructions, expected_findings)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
     RETURNING *`,
    [title, slug, description, objectives, scenario, difficulty, category,
      tags, estimated_time_minutes, instructions, expected_findings]
  );

  return result.rows[0];
};

export const getLabBySlug = async (slug) => {
  const result = await query('SELECT * FROM labs WHERE slug = $1', [slug]);
  return result.rows[0];
};

export const getLabById = async (id) => {
  const result = await query('SELECT * FROM labs WHERE id = $1', [id]);
  return result.rows[0];
};

export const getAllLabs = async (filters = {}) => {
  let queryStr = 'SELECT * FROM labs WHERE is_published = true';
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

export const submitLabSolution = async (userId, labId, submission) => {
  const result = await query(
    `INSERT INTO lab_submissions (user_id, lab_id, submission_data, submitted_at)
     VALUES ($1, $2, $3, CURRENT_TIMESTAMP)
     RETURNING *`,
    [userId, labId, JSON.stringify(submission)]
  );

  return result.rows[0];
};

export const getLabSubmissions = async (userId, labId) => {
  const result = await query(
    'SELECT * FROM lab_submissions WHERE user_id = $1 AND lab_id = $2 ORDER BY submitted_at DESC',
    [userId, labId]
  );

  return result.rows;
};
