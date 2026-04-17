-- Migration: Add headPosition column to staff table
-- This adds support for department head positions

-- Add the headPosition column if it doesn't exist
ALTER TABLE staff 
ADD COLUMN IF NOT EXISTS headPosition varchar(100) DEFAULT NULL;

-- Add index for better performance
ALTER TABLE staff 
ADD INDEX IF NOT EXISTS idx_head_position (headPosition);

-- Verify the column was added
SELECT COLUMN_NAME, DATA_TYPE, IS_NULLABLE 
FROM INFORMATION_SCHEMA.COLUMNS 
WHERE TABLE_NAME='staff' AND COLUMN_NAME='headPosition';
