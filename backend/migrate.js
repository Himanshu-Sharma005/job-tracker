const pool = require('./config/db');

async function migrate() {
  try {
    console.log('Adding UNIQUE constraint to jobs table...');
    await pool.query('ALTER TABLE jobs ADD CONSTRAINT unique_job_app UNIQUE (user_id, company_name, role);');
    console.log('Migration successful.');
  } catch (err) {
    if (err.code === 'ER_DUP_KEYNAME') {
      console.log('Constraint already exists. Skipping.');
    } else {
      console.error('Migration failed:', err);
    }
  } finally {
    process.exit(0);
  }
}

migrate();
