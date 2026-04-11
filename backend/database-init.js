// Database initialization script - creates all necessary tables
import db from './db.js';

export function initializeTables() {
  // Videos table
  const videosTableSql = `
    CREATE TABLE IF NOT EXISTS videos (
      id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
      title VARCHAR(255) NOT NULL,
      description TEXT,
      embedUrl VARCHAR(500),
      videoUrl VARCHAR(500),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    )
  `;

  // News table
  const newsTableSql = `
    CREATE TABLE IF NOT EXISTS news (
      id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
      path VARCHAR(255) UNIQUE,
      title VARCHAR(255) NOT NULL,
      date VARCHAR(100),
      subtitle TEXT,
      body TEXT,
      localYMCA VARCHAR(100),
      imageUrl VARCHAR(500),
      category VARCHAR(50),
      topic VARCHAR(100),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    )
  `;

  function ensureNewsColumn(column, definition) {
    db.query(`SHOW COLUMNS FROM news LIKE '${column}'`, (err, result) => {
      if (err) {
        console.error(`Unable to check news.${column} column:`, err);
        return;
      }

      if (!result || result.length === 0) {
        db.query(`ALTER TABLE news ADD COLUMN ${column} ${definition}`, (alterErr) => {
          if (alterErr) {
            console.error(`Unable to add news.${column} column:`, alterErr);
          } else {
            console.log(`Added news.${column} column successfully`);
          }
        });
      }
    });
  }

  // Calendar events table
  const calendarTableSql = `
    CREATE TABLE IF NOT EXISTS calendar_events (
      id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
      title VARCHAR(255) NOT NULL,
      date DATE NOT NULL,
      description TEXT,
      imageUrl VARCHAR(500),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    )
  `;

  // Locals table (Where We Are)
  const localsTableSql = `
    CREATE TABLE IF NOT EXISTS locals (
      id VARCHAR(100) NOT NULL PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      established VARCHAR(50),
      facebookUrl VARCHAR(500),
      instagramUrl VARCHAR(500),
      twitterUrl VARCHAR(500),
      heroImageUrl VARCHAR(500),
      logoImageUrl VARCHAR(500),
      corporate INT DEFAULT 0,
      nonCorporate INT DEFAULT 0,
      youth INT DEFAULT 0,
      others INT DEFAULT 0,
      totalMembersAsOf VARCHAR(50),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    )
  `;

  // Pillars table (local pillars) - create without foreign key first
  const pillarsTableSql = `
    CREATE TABLE IF NOT EXISTS pillars (
      id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
      localId VARCHAR(100) NOT NULL,
      \`key\` VARCHAR(50) NOT NULL,
      label VARCHAR(255) NOT NULL,
      color VARCHAR(50),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      UNIQUE KEY unique_local_pillar (localId, \`key\`)
    )
  `;

  // Pillar programs table - create without foreign key first
  const pillarProgramsTableSql = `
    CREATE TABLE IF NOT EXISTS pillar_programs (
      id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
      pillarId INT NOT NULL,
      title VARCHAR(255),
      bullets JSON,
      sequenceOrder INT DEFAULT 0,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    )
  `;

  // Staff members table (Meet Our Family)
  const staffTableSql = `
    CREATE TABLE IF NOT EXISTS staff (
      id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      position VARCHAR(255) NOT NULL,
      imageUrl VARCHAR(500),
      departmentGroup VARCHAR(255),
      sequenceOrder INT DEFAULT 0,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    )
  `;

  // Submitted YMCA updates table
  const submitArticleTableSql = `
    CREATE TABLE IF NOT EXISTS submit_article (
      id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      local_ymca VARCHAR(100) NOT NULL,
      title VARCHAR(255) NOT NULL,
      subtitle VARCHAR(255) NOT NULL,
      article_link VARCHAR(1000) NOT NULL,
      email VARCHAR(255) NOT NULL,
      message TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `;

  // Donations table for tracking submitted donations
  const donationsTableSql = `
    CREATE TABLE IF NOT EXISTS donations (
      donation_id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(100) NOT NULL,
      surname VARCHAR(100) NOT NULL,
      email VARCHAR(255) NOT NULL,
      phone VARCHAR(50),
      amount_usd DECIMAL(12,2) NOT NULL,
      currency VARCHAR(10) NOT NULL,
      payment_method VARCHAR(50),
      country VARCHAR(100),
      address1 VARCHAR(255),
      address2 VARCHAR(255),
      city VARCHAR(100),
      region VARCHAR(100),
      zip VARCHAR(50),
      comments TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `;

  // Ensure social media columns exist in locals table
  function ensureLocalsColumn(column, definition) {
    db.query(`SHOW COLUMNS FROM locals LIKE '${column}'`, (err, result) => {
      if (err) {
        console.error(`Unable to check locals.${column} column:`, err);
        return;
      }

      if (!result || result.length === 0) {
        db.query(`ALTER TABLE locals ADD COLUMN ${column} ${definition}`, (alterErr) => {
          if (alterErr) {
            console.error(`Unable to add locals.${column} column:`, alterErr);
          } else {
            console.log(`Added locals.${column} column successfully`);
          }
        });
      }
    });
  }

  // Create news table and ensure new fields exist for body and localYMCA.
  db.query(newsTableSql, (err) => {
    if (err) {
      console.error('Error creating news table:', err);
    } else {
      console.log('News table created or exists successfully');
      ensureNewsColumn('body', 'TEXT');
      ensureNewsColumn('localYMCA', 'VARCHAR(100)');
    }
  });

  // Ensure locals table has social media columns
  ensureLocalsColumn('instagramUrl', 'VARCHAR(500)');
  ensureLocalsColumn('twitterUrl', 'VARCHAR(500)');

  // Execute creation for remaining tables in correct dependency order
  const tables = [
    videosTableSql,
    calendarTableSql,
    localsTableSql,  // Must be created before pillars
    pillarsTableSql, // References locals
    pillarProgramsTableSql, // References pillars
    staffTableSql,
    submitArticleTableSql,
    donationsTableSql,
  ];

  // Create tables sequentially to handle foreign key dependencies
  let tableIndex = 0;
  const createNextTable = () => {
    if (tableIndex >= tables.length) {
      console.log('All tables created successfully');
      // Now add foreign key constraints
      addForeignKeyConstraints();
      return;
    }

    const sql = tables[tableIndex];
    db.query(sql, (err) => {
      if (err) {
        console.error(`Error creating table ${tableIndex}:`, err);
      } else {
        console.log(`Table ${tableIndex} created or exists successfully`);
      }
      tableIndex++;
      createNextTable();
    });
  };

  const addForeignKeyConstraints = () => {
    // Skip foreign key constraints for now to avoid database compatibility issues
    console.log('Skipping foreign key constraints to ensure database compatibility');
  };

  createNextTable();
}

export default initializeTables;
