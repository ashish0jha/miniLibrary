ALTER TABLE users 
ADD COLUMN IF NOT EXISTS role 
VARCHAR(10) NOT NULL DEFAULT 'student' CHECK (role IN ('admin','student'))