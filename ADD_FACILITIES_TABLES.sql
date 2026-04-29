-- Migration: Add Facilities Tables
-- This SQL creates the missing facilities tables needed for the admin panel

-- Create facilities table for YMCA facilities per local
CREATE TABLE IF NOT EXISTS `facilities` (
  `id` int NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `local_id` varchar(100) NOT NULL,
  `buildings` varchar(255) DEFAULT NULL,
  `buildings_pillar_id` int DEFAULT NULL,
  `room_accommodations` varchar(255) DEFAULT NULL,
  `room_accommodations_pillar_id` int DEFAULT NULL,
  `basketball_court` varchar(255) DEFAULT NULL,
  `basketball_court_pillar_id` int DEFAULT NULL,
  `swimming_pool` varchar(255) DEFAULT NULL,
  `swimming_pool_pillar_id` int DEFAULT NULL,
  `fitness_gym` varchar(255) DEFAULT NULL,
  `fitness_gym_pillar_id` int DEFAULT NULL,
  `function_hall` varchar(255) DEFAULT NULL,
  `function_hall_pillar_id` int DEFAULT NULL,
  `badminton_court` varchar(255) DEFAULT NULL,
  `badminton_court_pillar_id` int DEFAULT NULL,
  `tennis_court` varchar(255) DEFAULT NULL,
  `tennis_court_pillar_id` int DEFAULT NULL,
  `martial_arts` varchar(255) DEFAULT NULL,
  `martial_arts_pillar_id` int DEFAULT NULL,
  `spaces` varchar(255) DEFAULT NULL,
  `spaces_pillar_id` int DEFAULT NULL,
  `other_facilities` varchar(255) DEFAULT NULL,
  `other_facilities_pillar_id` int DEFAULT NULL,
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
