--These queries are for Postgres deployed on AWS EC2
--Make sure the csv files have been tranferred from local to EC2
--Make sure the csv files have been tranferred EC2 to inside the Docker Container

TRUNCATE qa.questions, qa.answers, qa.answers_photos;

\copy qa.questions
from 'sdc/questions.csv'
with DELIMITER ','
CSV HEADER;

\copy qa.answers
from 'sdc/answers.csv'
with DELIMITER ','
CSV HEADER;

\copy qa.answers_photos
from 'sdc/answers_photos.csv'
with DELIMITER ','
CSV HEADER;