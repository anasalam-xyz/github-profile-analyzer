CREATE TABLE IF NOT EXISTS profiles (
  id INT AUTO_INCREMENT PRIMARY KEY,
  github_id BIGINT NOT NULL UNIQUE,
  username VARCHAR(100) NOT NULL UNIQUE,
  name VARCHAR(255),
  bio TEXT,
  location VARCHAR(255),
  avatar_url VARCHAR(500),
  github_url VARCHAR(500),
  followers INT DEFAULT 0,
  following INT DEFAULT 0,
  public_repos INT DEFAULT 0,
  created_at_github DATETIME,
  analyzed_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS insights (
  id INT AUTO_INCREMENT PRIMARY KEY,
  profile_id INT NOT NULL,
  total_stars INT DEFAULT 0,
  total_forks INT DEFAULT 0,
  languages JSON,
  top_repos JSON,
  recorded_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (profile_id)
    REFERENCES profiles(id)
    ON DELETE CASCADE
);
