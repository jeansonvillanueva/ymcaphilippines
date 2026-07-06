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
  `headPosition` varchar(100) DEFAULT NULL,
  `sequenceOrder` int DEFAULT 0,
  INDEX idx_department (departmentGroup),
  INDEX idx_sequence (sequenceOrder),
  INDEX idx_head_position (headPosition)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Create local table
CREATE TABLE IF NOT EXISTS `local` (
  `local_id` varchar(50) NOT NULL PRIMARY KEY,
  `name` varchar(200) NOT NULL,
  `established` year DEFAULT NULL,
  `facebook_url` varchar(255) DEFAULT NULL,
  `hero_image_url` varchar(255) DEFAULT NULL,
  `logo_image_url` varchar(255) DEFAULT NULL,
  `embedded_map_url` varchar(1000) DEFAULT NULL,
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

-- Create facilities table for YMCA facilities per local
CREATE TABLE IF NOT EXISTS `facilities` (
  `id` int NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `local_id` varchar(100) NOT NULL,
  `buildings` varchar(255) DEFAULT NULL,
  `buildings_enabled` BOOLEAN DEFAULT FALSE,
  `room_accommodations` varchar(255) DEFAULT NULL,
  `room_accommodations_enabled` BOOLEAN DEFAULT FALSE,
  `basketball_court` varchar(255) DEFAULT NULL,
  `basketball_court_enabled` BOOLEAN DEFAULT FALSE,
  `swimming_pool` varchar(255) DEFAULT NULL,
  `swimming_pool_enabled` BOOLEAN DEFAULT FALSE,
  `fitness_gym` varchar(255) DEFAULT NULL,
  `fitness_gym_enabled` BOOLEAN DEFAULT FALSE,
  `function_hall` varchar(255) DEFAULT NULL,
  `function_hall_enabled` BOOLEAN DEFAULT FALSE,
  `badminton_court` varchar(255) DEFAULT NULL,
  `badminton_court_enabled` BOOLEAN DEFAULT FALSE,
  `tennis_court` varchar(255) DEFAULT NULL,
  `tennis_court_enabled` BOOLEAN DEFAULT FALSE,
  `martial_arts` varchar(255) DEFAULT NULL,
  `martial_arts_enabled` BOOLEAN DEFAULT FALSE,
  `spaces` varchar(255) DEFAULT NULL,
  `spaces_enabled` BOOLEAN DEFAULT FALSE,
  `other_facilities` varchar(255) DEFAULT NULL,
  `other_facilities_enabled` BOOLEAN DEFAULT FALSE,
  `created_at` timestamp DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY unique_local_facilities (local_id),
  INDEX idx_local_id (local_id),
  CONSTRAINT fk_facilities_local FOREIGN KEY (local_id) REFERENCES `local`(local_id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Create facilities_images table
CREATE TABLE IF NOT EXISTS `facilities_images` (
  `id` int NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `local_id` varchar(100) NOT NULL,
  `image_url` varchar(500) NOT NULL,
  `image_order` int DEFAULT 0,
  `created_at` timestamp DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_local_id (local_id),
  CONSTRAINT fk_facilities_images_local FOREIGN KEY (local_id) REFERENCES `local`(local_id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Create news table
CREATE TABLE IF NOT EXISTS `news` (
  `id` int NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `path` varchar(255) UNIQUE,
  `title` varchar(255) NOT NULL,
  `date` varchar(100),
  `subtitle` text,
  `body` text,
  `localYMCA` varchar(100),
  `imageUrl` varchar(500),
  `category` varchar(50),
  `topic` varchar(100),
  `contentBlocks` longtext,
  `created_at` timestamp DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_path (path),
  INDEX idx_category (category),
  INDEX idx_topic (topic)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Create news_images table for news article slideshows
CREATE TABLE IF NOT EXISTS `news_images` (
  `id` int NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `news_id` int NOT NULL,
  `image_url` varchar(500) NOT NULL,
  `image_order` int DEFAULT 0,
  `created_at` timestamp DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_news_id (news_id),
  CONSTRAINT fk_news_images_news FOREIGN KEY (news_id) REFERENCES `news`(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Create calendar_events table (Calendar of Activities)
CREATE TABLE IF NOT EXISTS `calendar_events` (
  `id` int NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `title` varchar(255) NOT NULL,
  `date` date NOT NULL,
  `start_date` date DEFAULT NULL,
  `end_date` date DEFAULT NULL,
  `description` text DEFAULT NULL,
  `imageUrl` varchar(500) DEFAULT NULL,
  `documentTitle` varchar(255) DEFAULT NULL,
  `documentUrl` varchar(500) DEFAULT NULL,
  `documentFileName` varchar(255) DEFAULT NULL,
  `documentFileType` varchar(100) DEFAULT NULL,
  `documentFileSize` int DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_start_date (`start_date`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
