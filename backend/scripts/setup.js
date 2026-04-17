const mysql = require('mysql2/promise');
require('dotenv').config({ path: __dirname + '/../.env' });

async function setupDatabase() {
  let connection;
  try {
    console.log('Connecting to MySQL server...');
    connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
    });

    console.log(`Creating database IF NOT EXISTS \`${process.env.DB_NAME}\`...`);
    await connection.query(`CREATE DATABASE IF NOT EXISTS \`${process.env.DB_NAME}\`;`);
    
    console.log(`Using database \`${process.env.DB_NAME}\`...`);
    await connection.query(`USE \`${process.env.DB_NAME}\`;`);

    console.log('Creating users table...');
    await connection.query(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(100) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    console.log('Creating jobs table...');
    await connection.query(`
      CREATE TABLE IF NOT EXISTS jobs (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        company_name VARCHAR(100) NOT NULL,
        role VARCHAR(100) NOT NULL,
        status ENUM('Applied', 'Interview', 'Rejected', 'Offer') DEFAULT 'Applied',
        application_date DATE NOT NULL,
        notes TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      );
    `);

    console.log('Database and tables setup completed successfully.');
  } catch (err) {
    console.error('Error setting up the database:', err);
  } finally {
    if (connection) await connection.end();
  }
}

setupDatabase();
