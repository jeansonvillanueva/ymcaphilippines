-- Add enabled fields to facilities table
-- This allows admin to select which facilities show to users

ALTER TABLE `facilities` ADD COLUMN `buildings_enabled` BOOLEAN DEFAULT FALSE;
ALTER TABLE `facilities` ADD COLUMN `room_accommodations_enabled` BOOLEAN DEFAULT FALSE;
ALTER TABLE `facilities` ADD COLUMN `basketball_court_enabled` BOOLEAN DEFAULT FALSE;
ALTER TABLE `facilities` ADD COLUMN `swimming_pool_enabled` BOOLEAN DEFAULT FALSE;
ALTER TABLE `facilities` ADD COLUMN `fitness_gym_enabled` BOOLEAN DEFAULT FALSE;
ALTER TABLE `facilities` ADD COLUMN `function_hall_enabled` BOOLEAN DEFAULT FALSE;
ALTER TABLE `facilities` ADD COLUMN `badminton_court_enabled` BOOLEAN DEFAULT FALSE;
ALTER TABLE `facilities` ADD COLUMN `tennis_court_enabled` BOOLEAN DEFAULT FALSE;
ALTER TABLE `facilities` ADD COLUMN `martial_arts_enabled` BOOLEAN DEFAULT FALSE;
ALTER TABLE `facilities` ADD COLUMN `spaces_enabled` BOOLEAN DEFAULT FALSE;
ALTER TABLE `facilities` ADD COLUMN `other_facilities_enabled` BOOLEAN DEFAULT FALSE;
