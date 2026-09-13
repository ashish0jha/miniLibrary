ALTER TABLE users 
ADD COLUMN role 
VARCHAR(10) NOT NULL DEFAULT 'student' CHECK (role IN ('admin','student'))