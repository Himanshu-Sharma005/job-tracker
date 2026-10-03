// Import the database connection pool from the configuration folder
const pool = require("../config/db");

// Define a class named Job to hold all database operations for jobs
class Job {
  // Define a static asynchronous method to create a new job application
  static async create(
    userId,
    companyName,
    role,
    status,
    applicationDate,
    notes,
    priority = "Medium",
    reminderDate = null,
  ) {
    // Run an INSERT query and save the result array's first item into a variable named result
    const [result] = await pool.query(
      // The SQL command tells the database to insert a new row into the jobs table
      "INSERT INTO jobs (user_id, company_name, role, status, application_date, notes, priority, reminder_date) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
      // These are the safe, real values that will replace the question marks above
      [
        userId,
        companyName,
        role,
        status || "Applied",
        applicationDate,
        notes || "",
        priority,
        reminderDate,
      ],
      // Close the database query execution
    );
    // Return the result data (like the new row ID) back to whoever called this method
    return result;
    // Close the create method
  }

  // Define a static asynchronous method to find and list jobs for a specific user with filters
  static async findAllByUserId(
    userId,
    statusQuery = "",
    searchQuery = "",
    limit = 10,
    offset = 0,
    sortBy = "date",
  ) {
    // Start building the SQL command text to select all columns for a specific user id
    let query = "SELECT * FROM jobs WHERE user_id = ?";
    // Create an array to hold the query values, starting with the user id
    const params = [userId];

    // Check if the user wants to filter the results by a specific job status
    if (statusQuery) {
      // Add a status condition to the end of the SQL command text
      query += " AND status = ?";
      // Add the actual status value to our array of query values
      params.push(statusQuery);
      // Close the status filter check
    }

    // Check if the user entered text to search for a specific company name
    if (searchQuery) {
      // Add a company name search condition using the LIKE keyword to the SQL command text
      query += " AND company_name LIKE ?";
      // Put percentage signs around the search text so it matches partial words
      params.push(`%${searchQuery}%`);
      // Close the search query filter check
    }

    // Check if the user wants to sort the job listings by priority level
    if (sortBy === "priority") {
      // Add a custom sorting rule where High comes first, Medium second, Low third, and then apply pagination limits
      query +=
        " ORDER BY CASE priority WHEN 'High' THEN 1 WHEN 'Medium' THEN 2 WHEN 'Low' THEN 3 ELSE 4 END ASC, application_date DESC LIMIT ? OFFSET ?";
      // If the user wants to sort by date or anything else instead of priority
    } else {
      // Add a standard sorting rule by date from newest to oldest along with pagination limits
      query += " ORDER BY application_date DESC LIMIT ? OFFSET ?";
      // Close the sorting check
    }

    // Convert limit and offset to numbers and add them to the end of our values array
    params.push(parseInt(limit), parseInt(offset));

    // Run the final built SQL query with its values and unpack the rows from the database response
    const [rows] = await pool.query(query, params);
    // Return the list of job rows found in the database
    return rows;
    // Close the findAllByUserId method
  }

  // Define a static asynchronous method to count total jobs matching the user's filters
  static async countAllByUserId(userId, statusQuery = "", searchQuery = "") {
    // Start building the SQL command text to count rows for a specific user id
    let query = "SELECT COUNT(*) as total FROM jobs WHERE user_id = ?";
    // Create an array to hold the query values, starting with the user id
    const params = [userId];

    // Check if the user wants to count only jobs with a specific status
    if (statusQuery) {
      // Add a status condition to the end of the SQL command text
      query += " AND status = ?";
      // Add the actual status value to our array of query values
      params.push(statusQuery);
      // Close the status filter check
    }

    // Check if the user wants to count only jobs matching a company name search
    if (searchQuery) {
      // Add a company name search condition to the end of the SQL command text
      query += " AND company_name LIKE ?";
      // Put percentage signs around the search text for partial matching
      params.push(`%${searchQuery}%`);
      // Close the search query filter check
    }

    // Run the count SQL query with its values and unpack the rows from the database response
    const [rows] = await pool.query(query, params);
    // Return just the total number count from the first row of the results
    return rows[0].total;
    // Close the countAllByUserId method
  }

  // Define a static asynchronous method to check if a job application already exists
  static async findDuplicate(userId, companyName, role) {
    // Run a query to look for an existing job ID matching this user, company, and job role
    const [rows] = await pool.query(
      "SELECT id FROM jobs WHERE user_id = ? AND company_name = ? AND role = ?",
      // Provide the actual values to replace the question marks securely
      [userId, companyName, role],
      // Close the database query execution
    );
    // Return true if we found at least one matching row, otherwise return false
    return rows.length > 0;
    // Close the findDuplicate method
  }

  // Define a static asynchronous method to get statistics on job application statuses
  static async getStats(userId) {
    // Run a query to group jobs by status and count how many jobs are in each group for this user
    const [rows] = await pool.query(
      "SELECT status, COUNT(*) as count FROM jobs WHERE user_id = ? GROUP BY status",
      // Provide the user id to replace the question mark securely
      [userId],
      // Close the database query execution
    );

    // Create a default stats object with zero counters for all possible job categories
    const stats = { total: 0, Applied: 0, Interview: 0, Rejected: 0, Offer: 0 };
    // Loop through each row returned from the database query
    rows.forEach((row) => {
      // Turn the database text count into a number and save it under its matching status name
      stats[row.status] = parseInt(row.count);
      // Add that same number to our running total counter
      stats.total += parseInt(row.count);
      // Close the loop
    });

    // Return the fully filled stats object back to whoever called this method
    return stats;
    // Close the getStats method
  }

  // Define a static asynchronous method to find one specific job by its unique ID and user ID
  static async findById(id, userId) {
    // Run a query to select all data columns for a specific job ID belonging to a specific user
    const [rows] = await pool.query(
      "SELECT * FROM jobs WHERE id = ? AND user_id = ?",
      // Provide the unique job ID and user ID values for the question marks
      [id, userId],
      // Close the database query execution
    );
    // Return the first found job row from the results array
    return rows[0];
    // Close the findById method
  }

  // Define a static asynchronous method to update information for an existing job
  static async update(
    id,
    userId,
    companyName,
    role,
    status,
    applicationDate,
    notes,
    priority = "Medium",
    reminderDate = null,
  ) {
    // Run an UPDATE query and save the response details into a variable named result
    const [result] = await pool.query(
      // The SQL command tells the database to overwrite columns for a specific job row
      "UPDATE jobs SET company_name = ?, role = ?, status = ?, application_date = ?, notes = ?, priority = ?, reminder_date = ? WHERE id = ? AND user_id = ?",
      // Provide the updated values along with the matching job ID and user ID for the question marks
      [
        companyName,
        role,
        status,
        applicationDate,
        notes,
        priority,
        reminderDate,
        id,
        userId,
      ],
      // Close the database query execution
    );
    // Return the update result information back to whoever called this method
    return result;
    // Close the update method
  }

  // Define a static asynchronous method to find jobs that have reminders scheduled for today
  static async findReminders(userId) {
    // Run a query to select job rows where the reminder date matches the database's current date
    const [rows] = await pool.query(
      "SELECT * FROM jobs WHERE user_id = ? AND reminder_date = CURDATE() ORDER BY priority ASC, application_date DESC",
      // Provide the user id value for the question mark securely
      [userId],
      // Close the database query execution
    );
    // Return the list of reminder job rows found for today
    return rows;
    // Close the findReminders method
  }

  // Define a static asynchronous method to permanently remove a job application row
  static async delete(id, userId) {
    // Run a DELETE query to remove a specific job row matching both the job ID and user ID
    const [result] = await pool.query(
      "DELETE FROM jobs WHERE id = ? AND user_id = ?",
      // Provide the unique job ID and user ID values for the question marks
      [id, userId],
      // Close the database query execution
    );
    // Return the deletion result details back to whoever called this method
    return result;
    // Close the delete method
  }
  // Close the Job class block
}

// Share this Job class so that other files in the project can load and use it
module.exports = Job;
