-- Migration to add Stripe payment fields to donations table
-- Run this in phpMyAdmin or via SSH

ALTER TABLE donations ADD COLUMN IF NOT EXISTS payment_intent_id VARCHAR(100) AFTER payment_method;
ALTER TABLE donations ADD COLUMN IF NOT EXISTS status VARCHAR(50) DEFAULT 'pending' AFTER payment_intent_id;
ALTER TABLE donations ADD COLUMN IF NOT EXISTS stripe_charge_id VARCHAR(100) AFTER status;

-- Add unique constraint to prevent duplicate payments
ALTER TABLE donations ADD UNIQUE KEY unique_payment_intent (payment_intent_id);

-- Create index for faster queries
CREATE INDEX idx_status ON donations(status);
CREATE INDEX idx_created_at ON donations(created_at);

-- Display the updated table structure
DESCRIBE donations;
