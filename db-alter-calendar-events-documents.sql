-- Add document upload fields to calendar_events (ymcaph_db)
-- Run in phpMyAdmin: select database ymcaph_db, then import or paste this script.
-- Safe to re-run on MariaDB 10+ / MySQL 8.0.29+ (uses IF NOT EXISTS).

USE `ymcaph_db`;

ALTER TABLE `calendar_events`
  ADD COLUMN IF NOT EXISTS `documentTitle` VARCHAR(255) NULL DEFAULT NULL COMMENT 'Display title for attached document' AFTER `imageUrl`,
  ADD COLUMN IF NOT EXISTS `documentUrl` VARCHAR(500) NULL DEFAULT NULL COMMENT 'Public URL path to uploaded document file' AFTER `documentTitle`,
  ADD COLUMN IF NOT EXISTS `documentFileName` VARCHAR(255) NULL DEFAULT NULL COMMENT 'Original uploaded file name' AFTER `documentUrl`,
  ADD COLUMN IF NOT EXISTS `documentFileType` VARCHAR(100) NULL DEFAULT NULL COMMENT 'MIME type (e.g. application/pdf)' AFTER `documentFileName`,
  ADD COLUMN IF NOT EXISTS `documentFileSize` INT NULL DEFAULT NULL COMMENT 'File size in bytes' AFTER `documentFileType`;

DESCRIBE `calendar_events`;
