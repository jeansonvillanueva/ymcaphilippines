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
      imageUrl VARCHAR(500),
      category VARCHAR(50),
      topic VARCHAR(100),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    )
  `;

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

  // Pillars table (local pillars)
  const pillarsTableSql = `
    CREATE TABLE IF NOT EXISTS pillars (
      id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
      localId VARCHAR(100) NOT NULL,
      key VARCHAR(50) NOT NULL,
      label VARCHAR(255) NOT NULL,
      color VARCHAR(50),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      FOREIGN KEY (localId) REFERENCES locals(id),
      UNIQUE KEY unique_local_pillar (localId, key)
    )
  `;

  // Pillar programs table
  const pillarProgramsTableSql = `
    CREATE TABLE IF NOT EXISTS pillar_programs (
      id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
      pillarId INT NOT NULL,
      title VARCHAR(255),
      bullets JSON,
      sequenceOrder INT DEFAULT 0,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      FOREIGN KEY (pillarId) REFERENCES pillars(id) ON DELETE CASCADE
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

  // Execute table creation
  const tables = [
    videosTableSql,
    newsTableSql,
    calendarTableSql,
    localsTableSql,
    pillarsTableSql,
    pillarProgramsTableSql,
    staffTableSql,
  ];

  tables.forEach((sql, index) => {
    db.query(sql, (err) => {
      if (err) {
        console.error(`Error creating table ${index}:`, err);
      } else {
        console.log(`Table ${index} created or exists successfully`);
      }
    });
  });
}

export default initializeTables;
