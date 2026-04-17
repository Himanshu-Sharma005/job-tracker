const pool = require('./config/db');

async function migrate_v2() {
  try {
    console.log('Adding priority and reminder_date columns to jobs table...');
    await pool.query("ALTER TABLE jobs ADD COLUMN priority ENUM('Low', 'Medium', 'High') DEFAULT 'Medium';");
    await pool.query("ALTER TABLE jobs ADD COLUMN reminder_date DATE NULL;");
    console.log('V2 Migration successful.');
  } catch (err) {
    if (err.code === 'ER_DUP_FIELDNAME') {
      console.log('Columns already exist. Skipping.');
    } else {
      console.error('Migration failed:', err);
    }
  } finally {
    process.exit(0);
  }
}

migrate_v2();
