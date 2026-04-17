const pool = require('../config/db');

class Job {
  static async create(userId, companyName, role, status, applicationDate, notes, priority = 'Medium', reminderDate = null) {
    const [result] = await pool.query(
      'INSERT INTO jobs (user_id, company_name, role, status, application_date, notes, priority, reminder_date) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [userId, companyName, role, status || 'Applied', applicationDate, notes || '', priority, reminderDate]
    );
    return result;
  }

  static async findAllByUserId(userId, statusQuery = '', searchQuery = '', limit = 10, offset = 0, sortBy = 'date') {
    let query = 'SELECT * FROM jobs WHERE user_id = ?';
    const params = [userId];

    if (statusQuery) {
      query += ' AND status = ?';
      params.push(statusQuery);
    }

    if (searchQuery) {
      query += ' AND company_name LIKE ?';
      params.push(`%${searchQuery}%`);
    }

    if (sortBy === 'priority') {
      // Deterministic priority mapping
      query += " ORDER BY CASE priority WHEN 'High' THEN 1 WHEN 'Medium' THEN 2 WHEN 'Low' THEN 3 ELSE 4 END ASC, application_date DESC LIMIT ? OFFSET ?";
    } else {
      query += ' ORDER BY application_date DESC LIMIT ? OFFSET ?';
    }
    
    params.push(parseInt(limit), parseInt(offset));

    const [rows] = await pool.query(query, params);
    return rows;
  }

  static async countAllByUserId(userId, statusQuery = '', searchQuery = '') {
    let query = 'SELECT COUNT(*) as total FROM jobs WHERE user_id = ?';
    const params = [userId];

    if (statusQuery) {
      query += ' AND status = ?';
      params.push(statusQuery);
    }

    if (searchQuery) {
      query += ' AND company_name LIKE ?';
      params.push(`%${searchQuery}%`);
    }

    const [rows] = await pool.query(query, params);
    return rows[0].total;
  }

  static async findDuplicate(userId, companyName, role) {
    const [rows] = await pool.query(
      'SELECT id FROM jobs WHERE user_id = ? AND company_name = ? AND role = ?',
      [userId, companyName, role]
    );
    return rows.length > 0;
  }

  static async getStats(userId) {
    const [rows] = await pool.query(
      'SELECT status, COUNT(*) as count FROM jobs WHERE user_id = ? GROUP BY status',
      [userId]
    );
    
    // Format into an easily consumable object
    const stats = { total: 0, Applied: 0, Interview: 0, Rejected: 0, Offer: 0 };
    rows.forEach(row => {
      stats[row.status] = parseInt(row.count);
      stats.total += parseInt(row.count);
    });
    
    return stats;
  }

  static async findById(id, userId) {
    const [rows] = await pool.query(
      'SELECT * FROM jobs WHERE id = ? AND user_id = ?',
      [id, userId]
    );
    return rows[0];
  }

  static async update(id, userId, companyName, role, status, applicationDate, notes, priority = 'Medium', reminderDate = null) {
    const [result] = await pool.query(
      'UPDATE jobs SET company_name = ?, role = ?, status = ?, application_date = ?, notes = ?, priority = ?, reminder_date = ? WHERE id = ? AND user_id = ?',
      [companyName, role, status, applicationDate, notes, priority, reminderDate, id, userId]
    );
    return result;
  }

  // Simplified query returning explicit current-date follow-ups tailored to user scope
  static async findReminders(userId) {
    const [rows] = await pool.query(
      'SELECT * FROM jobs WHERE user_id = ? AND reminder_date = CURDATE() ORDER BY priority ASC, application_date DESC',
      [userId]
    );
    return rows;
  }

  static async delete(id, userId) {
    const [result] = await pool.query(
      'DELETE FROM jobs WHERE id = ? AND user_id = ?',
      [id, userId]
    );
    return result;
  }
}

module.exports = Job;
