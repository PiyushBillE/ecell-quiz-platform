const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const bcrypt = require('bcryptjs');

const dbPath = path.join(__dirname, 'database.sqlite');
const db = new sqlite3.Database(dbPath);

// Initialize database tables
db.serialize(() => {
  // Users table
  db.run(`CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT,
    role TEXT NOT NULL DEFAULT 'audience',
    google_id TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);

  // Quizzes table
  db.run(`CREATE TABLE IF NOT EXISTS quizzes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    is_active INTEGER DEFAULT 0
  )`);

  // Questions table
  db.run(`CREATE TABLE IF NOT EXISTS questions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    quiz_id INTEGER NOT NULL,
    question_text TEXT NOT NULL,
    image_url TEXT,
    FOREIGN KEY (quiz_id) REFERENCES quizzes(id) ON DELETE CASCADE
  )`);

  // Options table
  db.run(`CREATE TABLE IF NOT EXISTS options (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    question_id INTEGER NOT NULL,
    option_text TEXT NOT NULL,
    is_correct INTEGER DEFAULT 0,
    FOREIGN KEY (question_id) REFERENCES questions(id) ON DELETE CASCADE
  )`);

  // Create admin user with hardcoded credentials
  const adminEmail = 'EcellBVDU@ecell.com';
  const adminPassword = 'SharkTank2026';
  
  bcrypt.hash(adminPassword, 10, (err, hash) => {
    if (err) {
      console.error('Error hashing admin password:', err);
      return;
    }
    
    db.get('SELECT id FROM users WHERE email = ?', [adminEmail], (err, row) => {
      if (err) {
        console.error('Error checking admin user:', err);
        return;
      }
      
      if (!row) {
        db.run(
          'INSERT INTO users (email, password_hash, role) VALUES (?, ?, ?)',
          [adminEmail, hash, 'admin'],
          (err) => {
            if (err) {
              console.error('Error creating admin user:', err);
            } else {
              console.log('Admin user created successfully');
            }
          }
        );
      }
    });
  });
});

module.exports = db;

