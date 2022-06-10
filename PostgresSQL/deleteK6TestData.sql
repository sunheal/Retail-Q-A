DELETE FROM qa.questions WHERE asker_name = 'k6_tester';

DELETE FROM qa.answers_photos
  WHERE
    answer_id
  IN (
      SELECT id
      FROM qa.answers
      WHERE answerer_name = 'k6_tester'
    );

DELETE FROM qa.answers WHERE answerer_name = 'k6_tester';