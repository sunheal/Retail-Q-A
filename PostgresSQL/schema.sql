CREATE SCHEMA IF NOT EXISTS qa;

DROP TABLE IF EXISTS qa.questions, qa.answers, qa.answers_photos;

CREATE TABLE qa.questions (
  id SERIAL PRIMARY KEY,
  product_id INT NOT NULL,
  body TEXT,
  date BIGINT,
  asker_name VARCHAR(50),
  asker_email VARCHAR(100),
  reported INT DEFAULT 0,
  helpfulness INT DEFAULT 0
);

CREATE TABLE qa.answers (
  Id SERIAL PRIMARY KEY,
  question_id INT REFERENCES qa.questions (id),
  body TEXT,
  date BIGINT,
  answerer_name VARCHAR(50),
  answerer_email VARCHAR(100),
  reported INT DEFAULT 0,
  helpfulness INT DEFAULT 0
);

CREATE TABLE qa.answers_photos (
  id SERIAL PRIMARY KEY,
  answer_id INT REFERENCES qa.answers (id),
  url TEXT
);