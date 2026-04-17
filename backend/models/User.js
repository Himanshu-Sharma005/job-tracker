const pool = require('../config/db');

class User {
  static async create(name, email, hashedPassword) {
    const [result] = await pool.query(
      'INSERT INTO users (name, email, password) VALUES (?, ?, ?)',
      [name, email, hashedPassword]
    );
    return result;
  }

  static async findByEmail(email) {
    const [rows] = await pool.query(
      'SELECT * FROM users WHERE email = ?',
      [email]
    );
    return rows[0];
  }
  
  static async findById(id) {
    const [rows] = await pool.query(
      'SELECT id, name, email FROM users WHERE id = ?',
      [id]
    );
    return rows[0];
  }
}

module.exports = User;
