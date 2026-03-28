import express from 'express';
import cors from 'cors';
import db from './db.js';

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

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
    (name, local_ymca, title, subtitle, article_url, email, message)
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
  const { name, surname, email, phone_num, message } = req.body;

  // Validate required fields
  if (!name || !surname || !email) {
    return res.status(400).json({ error: 'Name, surname, and email are required' });
  }

  const sql = `
    INSERT INTO feedback (name, surname, email, phone_num, message)
    VALUES (?, ?, ?, ?, ?)
  `;

  db.query(
    sql,
    [name, surname, email, phone_num, message],
    (err, result) => {
      if (err) {
        console.error('Database error:', err);
        return res.status(500).json({ 
          error: 'Failed to submit feedback',
          details: err.message 
        });
      }

      res.json({ 
        message: 'Feedback submitted successfully',
        id: result.insertId 
      });
    }
  );
});



const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});