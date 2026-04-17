# Job Application Tracker

A full-stack, aesthetically pleasing web application to track your job hunt. This project is built prioritizing a clean, structured codebase without relying on heavy external state libraries or complex ORMs.

## Features
- 🔐 Secure JWT Authentication with bcrypt password hashing
- 📊 Dashboard to add, update, and manage job applications
- 🔍 Flexible text search by company name
- 🏷️ Status filtering (Applied, Interview, Offer, Rejected)
- 🎨 Modern glassmorphism UI built entirely with Vanilla CSS
- 🏗️ Custom MVC Backend API using Express and MySQL2

## Tech Stack
- **Frontend**: React (Vite), React Router v6
- **Backend**: Node.js, Express
- **Database**: MySQL
- **Styling**: Vanilla CSS (CSS Variables, Flexbox/Grid, Inter & Outfit Google Fonts)

## Setup and Running Locally

### Prerequisites
- Node.js installed
- MySQL running locally
- Git

### 1. Database Setup
Ensure your local MySQL instance is running.
Provide your credentials in the `backend/.env` file. By default, the app comes with a setup script that will *automatically create the database and tables* for you!

```bash
cd backend
npm install
npm run setup  # Runs the database initialization script
```

### 2. Backend Setup
Create an `.env` file in the `backend/` directory if you haven't:
```env
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=job_tracker
JWT_SECRET=mysecret123
```

Start the API Server:
```bash
npm start     # Or use: node server.js
```

### 3. Frontend Setup
Open a new terminal window:
```bash
cd frontend
npm install
npm run dev
```

The application should now be running. The frontend will be available at `http://localhost:5173` and the backend at `http://localhost:5000`.

## API Endpoints

### Auth Routes
- `POST /api/auth/signup` - Register a new user
- `POST /api/auth/login` - Authenticate an existing user and get a JWT token

### Job Routes (Requires Bearer Token)
- `GET /api/jobs` - Retrieve all jobs for the authenticated user
- `GET /api/jobs?search=Google&status=Applied` - Retrieve filtered jobs
- `POST /api/jobs` - Add a new job application
- `PUT /api/jobs/:id` - Update an application status/details
- `DELETE /api/jobs/:id` - Delete a job note

## Database Schema (MySQL)

```sql
CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE jobs (
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
```
