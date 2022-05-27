SELECT setval(pg_get_serial_sequence('qa.questions', 'id'), coalesce(max(id)+1, 1), false) FROM qa.questions;

SELECT setval(pg_get_serial_sequence('qa.answers', 'id'), coalesce(max(id)+1, 1), false) FROM qa.answers;

SELECT setval(pg_get_serial_sequence('qa.answers_photos', 'id'), coalesce(max(id)+1, 1), false) FROM qa.answers_photos;