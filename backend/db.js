import mysql from 'mysql2';

const db = mysql.createConnection({
  host: 'ymca.ph',
  user: 'ymcaph_user',
  password: 'e8f133def539f610fe95fa789ac08d6ee8f133def539f610fe95fa789ac08d6e',
  database: 'ymcaph_db'
});

db.connect((err) => {
  if (err) {
    console.error('Database connection failed:', err);
  } else {
    console.log('Connected to MySQL');
  }
});

export default db;