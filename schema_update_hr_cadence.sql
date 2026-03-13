-- Add heart_rate and cadence to records table
ALTER TABLE records ADD COLUMN IF NOT EXISTS heart_rate INTEGER;
ALTER TABLE records ADD COLUMN IF NOT EXISTS cadence INTEGER;
