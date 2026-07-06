-- Migration: calendar event document uploads (Admin Calendar of Activities)
-- Database: ymcaph_db
-- Stores document title + file metadata alongside existing imageUrl column.

USE `ymcaph_db`;

ALTER TABLE `calendar_events`
  ADD COLUMN IF NOT EXISTS `documentTitle` VARCHAR(255) NULL DEFAULT NULL AFTER `imageUrl`,
  ADD COLUMN IF NOT EXISTS `documentUrl` VARCHAR(500) NULL DEFAULT NULL AFTER `documentTitle`,
  ADD COLUMN IF NOT EXISTS `documentFileName` VARCHAR(255) NULL DEFAULT NULL AFTER `documentUrl`,
  ADD COLUMN IF NOT EXISTS `documentFileType` VARCHAR(100) NULL DEFAULT NULL AFTER `documentFileName`,
  ADD COLUMN IF NOT EXISTS `documentFileSize` INT NULL DEFAULT NULL AFTER `documentFileType`;

DESCRIBE `calendar_events`;
