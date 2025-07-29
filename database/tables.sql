CREATE TABLE users (
  user_id SERIAL PRIMARY KEY,
  username VARCHAR(50) NOT NULL UNIQUE,
  user_role varchar(255) DEFAULT '',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  hashed_password VARCHAR(255) NOT NULL,
  salt VARCHAR(255) NOT NULL
);





SELECT * from users;