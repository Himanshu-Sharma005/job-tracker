// importing db.js
const pool = require("../config/db");

// creating a blueprint called User
class User {
  // using async because DB operations are asynchronous and static because Static methods allow direct access like User.create() without creating an object instance.
  static async create(name, email, hashedPassword) {
    const [result] = await pool.query(
      // ? are placeholders used to prevent SQL injection attacks by safely parameterizing queries.
      "INSERT INTO users (name, email, password) VALUES (?, ?, ?)",
      [name, email, hashedPassword],
    );
    return result;
  }

  // Find user using email. Mostly used during login
  static async findByEmail(email) {
    // why rows?  Because SELECT returns array.
    const [rows] = await pool.query("SELECT * FROM users WHERE email = ?", [
      email,
    ]);
    // row[0] Because email should be unique.
    return rows[0];
  }

  // findById used for Get current logged in user. Likely GET /api/auth/me
  static async findById(id) {
    const [rows] = await pool.query(
      // Why select only id, name, email? To avoid exposing sensitive fields like password unnecessarily.
      "SELECT id, name, email FROM users WHERE id = ?",
      [id],
    );
    return rows[0];
  }
}

module.exports = User;
