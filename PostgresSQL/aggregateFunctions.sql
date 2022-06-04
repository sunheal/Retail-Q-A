-- GET Questions --
SELECT
  id AS question_id,
  body AS question_body,
  TO_TIMESTAMP(date / 1000)::date AS question_date,
  asker_name,
  helpfulness AS question_helpfulness,
  reported,
  (
    SELECT
      COALESCE (json_object_agg(key, value), '{}')
    FROM
      (SELECT
        answer_list.id AS key,
        to_jsonb(answer_list) AS value
      FROM
        (SELECT
          qa.answers.id,
          qa.answers.body,
          TO_TIMESTAMP(qa.answers.date / 1000)::date AS date,
          qa.answers.answerer_name,
          qa.answers.helpfulness,
          (SELECT
            COALESCE (jsonb_agg(to_jsonb(photo_list)), '[]')
          FROM
            (SELECT
              qa.answers_photos.id, qa.answers_photos.url
            FROM qa.answers_photos
            WHERE qa.answers_photos.answer_id = qa.answers.id) AS photo_list
          ) AS photos
        FROM qa.answers
        WHERE qa.answers.question_id = qa.questions.id) AS answer_list
      ) AS anseer_key_value_list
  ) AS answers
FROM qa.questions
WHERE product_id = ${product_id}
LIMIT ${count}
OFFSET ${offset};


-- GET Answers --
SELECT
  qa.answers.id AS answer_id,
  qa.answers.body,
  TO_TIMESTAMP(qa.answers.date / 1000)::date AS date,
  qa.answers.answerer_name,
  qa.answers.helpfulness,
  (SELECT
    COALESCE (jsonb_agg(to_jsonb(photo_list)), '[]')
  FROM
    (SELECT qa.answers_photos.id, qa.answers_photos.url FROM qa.answers_photos WHERE qa.answers_photos.answer_id = qa.answers.id) AS photo_list) AS photos
FROM qa.answers
WHERE question_id = ${question_id}
LIMIT ${count}
OFFSET ${offset};