-- YMCA Philippines Database Schema
-- This SQL creates all tables needed for the application

-- Create staff table
CREATE TABLE IF NOT EXISTS `staff` (
  `id` int NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `name` varchar(200) NOT NULL,
  `position` varchar(255) NOT NULL,
  `imageUrl` varchar(500) DEFAULT NULL,
  `departmentGroup` varchar(100) DEFAULT NULL,
  `secretaryType` varchar(100) DEFAULT NULL,
  `sequenceOrder` int DEFAULT 0,
  INDEX idx_department (departmentGroup),
  INDEX idx_sequence (sequenceOrder)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Create local table
CREATE TABLE IF NOT EXISTS `local` (
  `local_id` varchar(50) NOT NULL PRIMARY KEY,
  `name` varchar(200) NOT NULL,
  `established` year DEFAULT NULL,
  `facebook_url` varchar(255) DEFAULT NULL,
  `hero_image_url` varchar(255) DEFAULT NULL,
  `logo_image_url` varchar(255) DEFAULT NULL,
  `corporate` int DEFAULT 0,
  `non_corporate` int DEFAULT 0,
  `youth` int DEFAULT 0,
  `others` int DEFAULT 0,
  `total_members_as_of` year DEFAULT NULL,
  `instagramUrl` varchar(500) DEFAULT NULL,
  `twitterUrl` varchar(500) DEFAULT NULL,
  INDEX idx_local_id (local_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Create local_pillars table
CREATE TABLE IF NOT EXISTS `local_pillars` (
  `pillars_id` int NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `local_id` varchar(50) NOT NULL,
  `pillar_key` enum('community', 'work', 'planet', 'world') NOT NULL,
  `label` varchar(100) NOT NULL,
  `color` varchar(20) DEFAULT NULL,
  INDEX idx_local_id (local_id),
  INDEX idx_pillar_key (pillar_key),
  CONSTRAINT fk_local_id_pillars FOREIGN KEY (local_id) REFERENCES `local`(local_id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Create local_programs table
CREATE TABLE IF NOT EXISTS `local_programs` (
  `program_id` int NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `pillar_id` int NOT NULL,
  `title` varchar(200) NOT NULL,
  `sequence_order` int DEFAULT 0,
  INDEX idx_pillar_id (pillar_id),
  CONSTRAINT fk_pillar_id_programs FOREIGN KEY (pillar_id) REFERENCES `local_pillars`(pillars_id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Create local_programs_bullets table
CREATE TABLE IF NOT EXISTS `local_programs_bullets` (
  `bullet_id` int NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `program_id` int NOT NULL,
  `bullet_text` text NOT NULL,
  `sequence_order` int DEFAULT 0,
  INDEX idx_program_id (program_id),
  CONSTRAINT fk_program_id_bullets FOREIGN KEY (program_id) REFERENCES `local_programs`(program_id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
