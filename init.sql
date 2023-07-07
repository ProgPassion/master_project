-- Create 'users' table
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(255),
  password VARCHAR(255),
  role VARCHAR(255)
);

-- Create 'reports' table
CREATE TABLE reports (
  id SERIAL PRIMARY KEY,
  location VARCHAR(255),
  type VARCHAR(255),
  description VARCHAR(255),
  submit_timestamp TIMESTAMP,
  verdict_timestamp TIMESTAMP,
  status VARCHAR(255),
  user_id INT
);


