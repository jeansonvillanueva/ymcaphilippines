import express from 'express';
import cors from 'cors';
import db from './db.js';

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Ensure the feedback table exists, matching the actual schema in your database (feedback_id, phone_number)
const feedbackTableSql = `
  CREATE TABLE IF NOT EXISTS feedback (
    feedback_id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    surname VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone_number VARCHAR(50),
    message TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  )
`;

db.query(feedbackTableSql, (err) => {
  if (err) {
    console.error('Unable to ensure feedback table exists:', err);
    return;
  }

  console.log('Feedback table exists or was created successfully');

  // Ensure the feedback_id column is AUTO_INCREMENT and not null
  db.query("ALTER TABLE feedback MODIFY COLUMN feedback_id INT NOT NULL AUTO_INCREMENT", (alterErr) => {
    if (alterErr) {
      console.error('Unable to enforce feedback.feedback_id AUTO_INCREMENT:', alterErr);
    } else {
      console.log('feedback.feedback_id is AUTO_INCREMENT');
    }

    // Keep column names consistent: prefer phone_number and migrate phone_num -> phone_number
    db.query("SHOW COLUMNS FROM feedback LIKE 'phone_num'", (colErr, colRows) => {
      if (colErr) {
        console.error('Unable to check for phone_num column:', colErr);
      } else if (colRows && colRows.length > 0) {
        db.query("ALTER TABLE feedback CHANGE COLUMN phone_num phone_number VARCHAR(50)", (changeErr) => {
          if (changeErr) {
            console.error('Unable to rename phone_num to phone_number:', changeErr);
          } else {
            console.log('Renamed feedback.phone_num to phone_number');
          }
        });
      }

      // Remove invalid feedback_id=0 rows that may lead to duplicate PK errors
      db.query('DELETE FROM feedback WHERE feedback_id = 0', (deleteErr, deleteResult) => {
        if (deleteErr) {
          console.error('Unable to clean up feedback.feedback_id=0 rows:', deleteErr);
        } else if (deleteResult.affectedRows > 0) {
          console.log(`Deleted ${deleteResult.affectedRows} feedback rows with feedback_id=0`);
        }

        // Set auto-increment start to max+1 in case it is out of sync
        db.query('SELECT IFNULL(MAX(feedback_id), 0) + 1 AS nextId FROM feedback', (maxErr, maxRows) => {
          if (maxErr) {
            console.error('Unable to query max feedback_id for feedback:', maxErr);
            return;
          }

          const nextId = maxRows[0]?.nextId || 1;
          db.query(`ALTER TABLE feedback AUTO_INCREMENT = ${nextId}`, (aiErr) => {
            if (aiErr) {
              console.error('Unable to set feedback AUTO_INCREMENT value:', aiErr);
            } else {
              console.log(`feedback AUTO_INCREMENT set to ${nextId}`);
            }
          });
        });
      });
    });
  });
});

// Test route
app.get("/", (req, res) => {
    res.send("Server is running");
});

// GET articles from database
app.get("/api/articles", (req, res) => {
  db.query("SELECT * FROM submit_article", (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).send(err);
    }
    res.json(result);
  });
});

// GET users from database
app.get("/api/users", (req, res) => {
  db.query("SELECT * FROM users", (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).send(err);
    }
    res.json(result);
  });
});

// POST - Submit article update
app.post('/api/submit-update', (req, res) => {
  const { name, local_ymca, title, subtitle, articleUrl, email, message } = req.body;

  // Validate required fields
  if (!name || !local_ymca || !title || !subtitle || !articleUrl || !email) {
    console.error('Missing required fields:', { name, local_ymca, title, subtitle, articleUrl, email });
    return res.status(400).json({ error: 'Missing required fields' });
  }

    const sql = `
    INSERT INTO submit_article 
    (name, local_ymca, title, subtitle, article_link, email, message)
    VALUES (?, ?, ?, ?, ?, ?, ?)
    `;
    
  db.query(
    sql,
    [name, local_ymca, title, subtitle, articleUrl, email, message],
    (err, result) => {
      if (err) {
        console.error('Database error:', err);
        return res.status(500).json({ error: 'Failed to submit article', details: err.message });
      }
      res.json({ message: "Submitted successfully", id: result.insertId });
    }
  );
});

// TEST DATABASE CONNECTION
app.get("/test-db", (req, res) => {
  db.query("SELECT 1", (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).send("Database error");
    }
    res.send("Database is working!");
  });
});

// TEST YOUR TABLE
app.get("/test-article", (req, res) => {
  db.query("SELECT * FROM submit_article", (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).send(err);
    }
    res.json(result);
  });
});

// POST - Submit feedback
app.post('/api/feedback', (req, res) => {
  const { name, surname, email, phone_num, message, phone_number } = req.body;

  console.log('POST /api/feedback request body:', { name, surname, email, phone_num, phone_number, message });

  // Normalize phone field from front-end to backend schema
  const finalPhone = phone_number || phone_num || null;

  // Validate required fields
  if (!name || !surname || !email) {
    return res.status(400).json({ error: 'Name, surname, and email are required' });
  }

  // robust insert: if phone_number exists use it; if not, fallback to phone_num.
  const insertColumn = 'phone_number';
  const rawInsertSql = `INSERT INTO feedback (name, surname, email, ${insertColumn}, message) VALUES (?, ?, ?, ?, ?)`;

  db.query(rawInsertSql, [name, surname, email, finalPhone, message], (err, result) => {
    if (err) {
      if (err.code === 'ER_BAD_FIELD_ERROR' && err.sqlMessage.includes('phone_number')) {
        // fallback if old column exists
        const fallbackSql = 'INSERT INTO feedback (name, surname, email, phone_num, message) VALUES (?, ?, ?, ?, ?)';
        console.warn('Fallback to phone_num insert because phone_number column missing');
        db.query(fallbackSql, [name, surname, email, finalPhone, message], (fbErr, fbResult) => {
          if (fbErr) {
            console.error('Database error fallback:', fbErr);
            return res.status(500).json({ error: 'Failed to submit feedback', details: fbErr.message });
          }
          return res.json({ message: 'Feedback submitted successfully', id: fbResult.insertId });
        });
        return;
      }

      console.error('Database error:', err);
      return res.status(500).json({ error: 'Failed to submit feedback', details: err.message });
    }

    res.json({ message: 'Feedback submitted successfully', id: result.insertId });
  });
});



const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});