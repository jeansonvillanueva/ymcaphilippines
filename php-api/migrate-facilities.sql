-- MySQL migration script for new facilities table structure
-- Run this in PHPMyAdmin or command line to update your database

-- Step 1: Backup old facilities table (optional but recommended)
CREATE TABLE `facilities_backup` AS SELECT * FROM `facilities`;

-- Step 2: Drop old facilities table
DROP TABLE IF EXISTS `facilities`;

-- Step 3: Create new facilities_list table with flexible structure
CREATE TABLE IF NOT EXISTS `facilities_list` (
  `id` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `local_id` VARCHAR(100) NOT NULL,
  `facility_name` VARCHAR(255) NOT NULL,
  `facility_details` TEXT,
  `sequence_order` INT DEFAULT 0,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_local_id (local_id),
  INDEX idx_sequence (local_id, sequence_order),
  CONSTRAINT fk_facilities_list_local FOREIGN KEY (local_id) REFERENCES `local`(local_id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Note: facilities_images table remains unchanged
-- It already has the correct structure for the new format
