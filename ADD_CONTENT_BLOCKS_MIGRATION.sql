-- Migration: Add contentBlocks column to news table
-- This adds support for structured content with text and image blocks

-- Add the contentBlocks column if it doesn't exist
ALTER TABLE news
ADD COLUMN IF NOT EXISTS contentBlocks JSON DEFAULT ('[]');

-- Add index for better performance if needed
-- ALTER TABLE news ADD INDEX idx_content_blocks (contentBlocks); -- JSON columns can't be indexed directly in MySQL 5.7