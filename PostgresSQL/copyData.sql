TRUNCATE qa.questions, qa.answers, qa.answers_photos;

COPY qa.questions
FROM '/Users/sunheal/Bootcamp/SDC/ETL_data/questions.csv'
DELIMITER ','
CSV HEADER;

COPY qa.answers
FROM '/Users/sunheal/Bootcamp/SDC/ETL_data/answers.csv'
DELIMITER ','
CSV HEADER;

COPY qa.answers_photos
FROM '/Users/sunheal/Bootcamp/SDC/ETL_data/answers_photos.csv'
DELIMITER ','
CSV HEADER;