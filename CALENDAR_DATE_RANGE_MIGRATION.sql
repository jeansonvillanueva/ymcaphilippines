-- Calendar Events Date Range Migration
-- This migration adds start_date and end_date columns to the calendar_events table
-- Run this migration to add support for multi-day events

-- Add new columns if they don't exist
ALTER TABLE calendar_events 
ADD COLUMN IF NOT EXISTS start_date DATE NOT NULL DEFAULT CURDATE() AFTER date,
ADD COLUMN IF NOT EXISTS end_date DATE NOT NULL DEFAULT CURDATE() AFTER start_date;

-- Optional: Populate existing events with date range based on the old 'date' column
-- This maintains backward compatibility for existing single-day events
UPDATE calendar_events 
SET start_date = date, end_date = date 
WHERE start_date = CURDATE() AND end_date = CURDATE() AND date IS NOT NULL;

-- Add an index on start_date for faster queries
ALTER TABLE calendar_events ADD INDEX idx_start_date (start_date);

-- Verify the migration
DESCRIBE calendar_events;
