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

  // Locals table (Where We Are) - MUST match PHP API schema
  const localsTableSql = `
    CREATE TABLE IF NOT EXISTS \`local\` (
      local_id VARCHAR(50) NOT NULL PRIMARY KEY,
      name VARCHAR(200) NOT NULL,
      established YEAR DEFAULT NULL,
      facebook_url VARCHAR(255) DEFAULT NULL,
      instagramUrl VARCHAR(500) DEFAULT NULL,
      twitterUrl VARCHAR(500) DEFAULT NULL,
      hero_image_url VARCHAR(255) DEFAULT NULL,
      logo_image_url VARCHAR(255) DEFAULT NULL,
      corporate INT DEFAULT 0,
      non_corporate INT DEFAULT 0,
      youth INT DEFAULT 0,
      others INT DEFAULT 0,
      total_members_as_of YEAR DEFAULT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      INDEX idx_local_id (local_id)
    )
  `;

  // Pillars table (local pillars) - MUST match PHP API schema
  const pillarsTableSql = `
    CREATE TABLE IF NOT EXISTS local_pillars (
      pillars_id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
      local_id VARCHAR(50) NOT NULL,
      pillar_key ENUM('community', 'work', 'planet', 'world') NOT NULL,
      label VARCHAR(100) NOT NULL,
      color VARCHAR(20) DEFAULT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      INDEX idx_local_id (local_id),
      INDEX idx_pillar_key (pillar_key)
    )
  `;

  // Pillar programs table - MUST match PHP API schema
  const pillarProgramsTableSql = `
    CREATE TABLE IF NOT EXISTS local_programs (
      program_id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
      pillar_id INT NOT NULL,
      title VARCHAR(200) NOT NULL,
      sequence_order INT DEFAULT 0,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      INDEX idx_pillar_id (pillar_id)
    )
  `;

  // Pillar program bullets table
  const pillarProgramBulletsTableSql = `
    CREATE TABLE IF NOT EXISTS local_programs_bullets (
      bullet_id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
      program_id INT NOT NULL,
      bullet_text TEXT NOT NULL,
      sequence_order INT DEFAULT 0,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      INDEX idx_program_id (program_id)
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

  // Facilities table for YMCA facilities per local
  const facilitiesTableSql = `
    CREATE TABLE IF NOT EXISTS facilities (
      id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
      local_id VARCHAR(100) NOT NULL,
      buildings VARCHAR(255),
      buildings_pillar_id INT,
      room_accommodations VARCHAR(255),
      room_accommodations_pillar_id INT,
      basketball_court VARCHAR(255),
      basketball_court_pillar_id INT,
      swimming_pool VARCHAR(255),
      swimming_pool_pillar_id INT,
      fitness_gym VARCHAR(255),
      fitness_gym_pillar_id INT,
      function_hall VARCHAR(255),
      function_hall_pillar_id INT,
      badminton_court VARCHAR(255),
      badminton_court_pillar_id INT,
      tennis_court VARCHAR(255),
      tennis_court_pillar_id INT,
      martial_arts VARCHAR(255),
      martial_arts_pillar_id INT,
      spaces VARCHAR(255),
      spaces_pillar_id INT,
      other_facilities VARCHAR(255),
      other_facilities_pillar_id INT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      UNIQUE KEY unique_local_facilities (local_id)
    )
  `;

  // Facilities images table
  const facilitiesImagesTableSql = `
    CREATE TABLE IF NOT EXISTS facilities_images (
      id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
      local_id VARCHAR(100) NOT NULL,
      image_url VARCHAR(500) NOT NULL,
      image_order INT DEFAULT 0,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      INDEX idx_local_id (local_id)
    )
  `;

  // Ensure social media columns exist in local table
  function ensureLocalsColumn(column, definition) {
    db.query(`SHOW COLUMNS FROM \`local\` LIKE '${column}'`, (err, result) => {
      if (err) {
        console.error(`Unable to check local.${column} column:`, err);
        return;
      }

      if (!result || result.length === 0) {
        db.query(`ALTER TABLE \`local\` ADD COLUMN ${column} ${definition}`, (alterErr) => {
          if (alterErr) {
            console.error(`Unable to add local.${column} column:`, alterErr);
          } else {
            console.log(`Added local.${column} column successfully`);
          }
        });
      }
    });
  }

  // Ensure facilities columns exist for pillar assignments
  function ensureFacilitiesColumn(column, definition) {
    db.query(`SHOW COLUMNS FROM facilities LIKE '${column}'`, (err, result) => {
      if (err) {
        console.error(`Unable to check facilities.${column} column:`, err);
        return;
      }

      if (!result || result.length === 0) {
        db.query(`ALTER TABLE facilities ADD COLUMN ${column} ${definition}`, (alterErr) => {
          if (alterErr) {
            console.error(`Unable to add facilities.${column} column:`, alterErr);
          } else {
            console.log(`Added facilities.${column} column successfully`);
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
      ensureNewsColumn('contentBlocks', 'LONGTEXT');
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
    pillarProgramBulletsTableSql, // References pillar programs
    staffTableSql,
    submitArticleTableSql,
    donationsTableSql,
    facilitiesTableSql,
    facilitiesImagesTableSql,
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
    
    // Ensure facilities have pillar assignment columns
    const facilityFields = [
      'buildings', 'room_accommodations', 'basketball_court', 'swimming_pool', 
      'fitness_gym', 'function_hall', 'badminton_court', 'tennis_court', 
      'martial_arts', 'spaces', 'other_facilities'
    ];
    
    facilityFields.forEach(field => {
      ensureFacilitiesColumn(`${field}_pillar_id`, 'INT DEFAULT NULL');
    });
  };

  createNextTable();
}

export default initializeTables;
