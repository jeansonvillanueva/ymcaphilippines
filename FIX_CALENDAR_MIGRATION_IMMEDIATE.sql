-- CALENDAR DATE RANGE MIGRATION FOR EXISTING DATABASE
-- This adds the missing start_date and end_date columns to calendar_events table
-- Run this immediately to fix the "Invalid Date" issue

-- Step 1: Add the new columns
ALTER TABLE calendar_events 
ADD COLUMN start_date DATE AFTER date,
ADD COLUMN end_date DATE AFTER start_date;

-- Step 2: Populate existing events with date range based on the old 'date' column
UPDATE calendar_events 
SET start_date = date, end_date = date 
WHERE date IS NOT NULL AND (start_date IS NULL OR end_date IS NULL);

-- Step 3: Add index for faster queries on start_date
ALTER TABLE calendar_events ADD INDEX idx_start_date (start_date);

-- Step 4: Verify the migration
-- Run this to check: DESCRIBE calendar_events;
-- You should see all these columns:
-- id, title, date, start_date, end_date, description, imageUrl, created_at, updated_at
