import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import multer from 'multer';
import { fileURLToPath } from 'url';
import db from './db.js';
import initializeTables from './database-init.js';

const app = express();

// Initialize all tables
initializeTables();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const uploadDir = path.join(__dirname, 'uploads');
fs.mkdirSync(uploadDir, { recursive: true });
app.use('/uploads', express.static(uploadDir));

const storage = multer.diskStorage({
  destination: uploadDir,
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (!file.mimetype.startsWith('image/')) {
      return cb(new Error('Only image uploads are allowed')); 
    }
    cb(null, true);
  },
});

function createNewsPath(title) {
  const slug = title
    .toString()
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '');
  return `/news/${slug || Date.now()}`;
}

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

// GET news from database
app.get("/api/news", (req, res) => {
  db.query("SELECT * FROM news ORDER BY created_at DESC", (err, result) => {
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
// ============ ADMIN API ROUTES ============

// VIDEOS - Admin Management
app.get("/admin/videos", (req, res) => {
  db.query("SELECT * FROM videos ORDER BY created_at DESC", (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(result);
  });
});

app.post("/admin/videos", (req, res) => {
  const { title, description, embedUrl, videoUrl } = req.body;
  if (!title) return res.status(400).json({ error: "Title is required" });
  
  db.query(
    "INSERT INTO videos (title, description, embedUrl, videoUrl) VALUES (?, ?, ?, ?)",
    [title, description, embedUrl, videoUrl],
    (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ id: result.insertId, message: "Video added successfully" });
    }
  );
});

app.put("/admin/videos/:id", (req, res) => {
  const { title, description, embedUrl, videoUrl } = req.body;
  db.query(
    "UPDATE videos SET title=?, description=?, embedUrl=?, videoUrl=? WHERE id=?",
    [title, description, embedUrl, videoUrl, req.params.id],
    (err) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ message: "Video updated successfully" });
    }
  );
});

app.delete("/admin/videos/:id", (req, res) => {
  db.query("DELETE FROM videos WHERE id=?", [req.params.id], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: "Video deleted successfully" });
  });
});

// NEWS - Admin Management
app.get("/admin/news", (req, res) => {
  db.query("SELECT * FROM news ORDER BY created_at DESC", (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(result);
  });
});

app.post("/admin/news", upload.single('image'), (req, res) => {
  const { path, title, date, subtitle, body, localYMCA, imageUrl, category, topic } = req.body || {};
  if (!title) return res.status(400).json({ error: "Title is required" });

  const newsPath = (path && path.trim()) || createNewsPath(title);
  const imagePath = req.file ? `/uploads/${req.file.filename}` : imageUrl;

  db.query(
    "INSERT INTO news (path, title, date, subtitle, body, localYMCA, imageUrl, category, topic) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
    [newsPath, title, date, subtitle, body, localYMCA, imagePath, category, topic],
    (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ id: result.insertId, message: "News added successfully" });
    }
  );
});

app.put("/admin/news/:id", upload.single('image'), (req, res) => {
  const { path, title, date, subtitle, body, localYMCA, imageUrl, category, topic } = req.body;
  const newsPath = (path && path.trim()) || createNewsPath(title);
  const imagePath = req.file ? `/uploads/${req.file.filename}` : imageUrl;

  db.query(
    "UPDATE news SET path=?, title=?, date=?, subtitle=?, body=?, localYMCA=?, imageUrl=?, category=?, topic=? WHERE id=?",
    [newsPath, title, date, subtitle, body, localYMCA, imagePath, category, topic, req.params.id],
    (err) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ message: "News updated successfully" });
    }
  );
});

app.delete("/admin/news/:id", (req, res) => {
  db.query("DELETE FROM news WHERE id=?", [req.params.id], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: "News deleted successfully" });
  });
});

// CALENDAR EVENTS - Admin Management
app.get("/admin/calendar", (req, res) => {
  db.query("SELECT * FROM calendar_events ORDER BY date DESC", (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(result);
  });
});

app.post("/admin/calendar", (req, res) => {
  const { title, date, description, imageUrl } = req.body;
  if (!title || !date) return res.status(400).json({ error: "Title and date are required" });
  
  db.query(
    "INSERT INTO calendar_events (title, date, description, imageUrl) VALUES (?, ?, ?, ?)",
    [title, date, description, imageUrl],
    (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ id: result.insertId, message: "Event added successfully" });
    }
  );
});

app.put("/admin/calendar/:id", (req, res) => {
  const { title, date, description, imageUrl } = req.body;
  db.query(
    "UPDATE calendar_events SET title=?, date=?, description=?, imageUrl=? WHERE id=?",
    [title, date, description, imageUrl, req.params.id],
    (err) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ message: "Event updated successfully" });
    }
  );
});

app.delete("/admin/calendar/:id", (req, res) => {
  db.query("DELETE FROM calendar_events WHERE id=?", [req.params.id], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: "Event deleted successfully" });
  });
});

// LOCALS (Where We Are) - Admin Management
app.get("/admin/locals", (req, res) => {
  db.query("SELECT * FROM locals ORDER BY name", (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(result);
  });
});

app.get("/admin/locals/:id", (req, res) => {
  db.query("SELECT * FROM locals WHERE id=?", [req.params.id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!result.length) return res.status(404).json({ error: "Local not found" });
    res.json(result[0]);
  });
});

app.post("/admin/locals", (req, res) => {
  const { id, name, established, facebookUrl, heroImageUrl, logoImageUrl, corporate, nonCorporate, youth, others, totalMembersAsOf } = req.body;
  if (!id || !name) return res.status(400).json({ error: "ID and name are required" });
  
  db.query(
    "INSERT INTO locals (id, name, established, facebookUrl, heroImageUrl, logoImageUrl, corporate, nonCorporate, youth, others, totalMembersAsOf) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
    [id, name, established, facebookUrl, heroImageUrl, logoImageUrl, corporate || 0, nonCorporate || 0, youth || 0, others || 0, totalMembersAsOf],
    (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ id, message: "Local added successfully" });
    }
  );
});

app.put("/admin/locals/:id", (req, res) => {
  const { name, established, facebookUrl, heroImageUrl, logoImageUrl, corporate, nonCorporate, youth, others, totalMembersAsOf } = req.body;
  db.query(
    "UPDATE locals SET name=?, established=?, facebookUrl=?, heroImageUrl=?, logoImageUrl=?, corporate=?, nonCorporate=?, youth=?, others=?, totalMembersAsOf=? WHERE id=?",
    [name, established, facebookUrl, heroImageUrl, logoImageUrl, corporate || 0, nonCorporate || 0, youth || 0, others || 0, totalMembersAsOf, req.params.id],
    (err) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ message: "Local updated successfully" });
    }
  );
});

// PILLARS - Admin Management
app.get("/admin/pillars/:localId", (req, res) => {
  db.query(
    `SELECT p.*, GROUP_CONCAT(JSON_OBJECT('id', pp.id, 'title', pp.title, 'bullets', pp.bullets, 'sequenceOrder', pp.sequenceOrder) SEPARATOR ',') as programs
     FROM pillars p
     LEFT JOIN pillar_programs pp ON p.id = pp.pillarId
     WHERE p.localId=?
     GROUP BY p.id`,
    [req.params.localId],
    (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json(result);
    }
  );
});

app.put("/admin/pillars/:id", (req, res) => {
  const { key, label, color } = req.body;
  db.query(
    "UPDATE pillars SET key=?, label=?, color=? WHERE id=?",
    [key, label, color, req.params.id],
    (err) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ message: "Pillar updated successfully" });
    }
  );
});

app.post("/admin/pillar-programs", (req, res) => {
  const { pillarId, title, bullets, sequenceOrder } = req.body;
  db.query(
    "INSERT INTO pillar_programs (pillarId, title, bullets, sequenceOrder) VALUES (?, ?, ?, ?)",
    [pillarId, title, JSON.stringify(bullets), sequenceOrder || 0],
    (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ id: result.insertId, message: "Program added successfully" });
    }
  );
});

app.put("/admin/pillar-programs/:id", (req, res) => {
  const { title, bullets, sequenceOrder } = req.body;
  db.query(
    "UPDATE pillar_programs SET title=?, bullets=?, sequenceOrder=? WHERE id=?",
    [title, JSON.stringify(bullets), sequenceOrder || 0, req.params.id],
    (err) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ message: "Program updated successfully" });
    }
  );
});

app.delete("/admin/pillar-programs/:id", (req, res) => {
  db.query("DELETE FROM pillar_programs WHERE id=?", [req.params.id], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: "Program deleted successfully" });
  });
});

// STAFF (Meet Our Family) - Admin Management
app.get("/admin/staff", (req, res) => {
  db.query("SELECT * FROM staff ORDER BY departmentGroup, sequenceOrder", (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(result);
  });
});

app.post("/admin/staff", (req, res) => {
  const { name, position, imageUrl, departmentGroup, sequenceOrder } = req.body;
  if (!name || !position) return res.status(400).json({ error: "Name and position are required" });
  
  db.query(
    "INSERT INTO staff (name, position, imageUrl, departmentGroup, sequenceOrder) VALUES (?, ?, ?, ?, ?)",
    [name, position, imageUrl, departmentGroup, sequenceOrder || 0],
    (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ id: result.insertId, message: "Staff added successfully" });
    }
  );
});

app.put("/admin/staff/:id", (req, res) => {
  const { name, position, imageUrl, departmentGroup, sequenceOrder } = req.body;
  db.query(
    "UPDATE staff SET name=?, position=?, imageUrl=?, departmentGroup=?, sequenceOrder=? WHERE id=?",
    [name, position, imageUrl, departmentGroup, sequenceOrder || 0, req.params.id],
    (err) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ message: "Staff updated successfully" });
    }
  );
});

app.delete("/admin/staff/:id", (req, res) => {
  db.query("DELETE FROM staff WHERE id=?", [req.params.id], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: "Staff deleted successfully" });
  });
});

app.use((err, req, res, next) => {
  if (err && err.code === 'LIMIT_FILE_SIZE') {
    return res.status(413).json({ error: 'Uploaded image is too large. Maximum size is 5 MB.' });
  }
  if (err && err.message === 'Only image uploads are allowed') {
    return res.status(400).json({ error: err.message });
  }
  if (err) {
    return res.status(500).json({ error: err.message });
  }
  next();
});

const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});