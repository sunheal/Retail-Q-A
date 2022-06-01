const { Pool } = require('pg');

const pool = new Pool({
  host: 'localhost',
  port: '5432',
  user: 'sunheal',
  database: 'sdc',
  max: 20, // how many maximum connections do you want?
  connectionTimeoutMillis: 0, // how long i should wait for a db to give me a connection if all connections are busy? zero means to wait forever.
  idleTimeoutMillis: 0, // if all connections are not in use when do you want db to end. zero means db never end.
});

const aggregate_getQuestions = async (product_id, count) => {
  try {
    const data = await pool.query(`
    SELECT
      id AS question_id,
      body AS question_body,
      TO_TIMESTAMP(date / 1000)::date AS question_date,
      asker_name,
      helpfulness AS question_helpfulness,
      reported,
      (
        SELECT
          json_object_agg(key, value)
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
                jsonb_agg(to_jsonb(photo_list))
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
    LIMIT ${count};
    `);
    return data;
  } catch (err) {
    console.error('getQuestions Error', err);
  }
}

const aggregate_getAnswers = async (question_id, count) => {
  try {
    if (!count) {
      count = 50;
    }
    const data = await pool.query(`
      SELECT
        qa.answers.id AS answer_id,
        qa.answers.body,
        TO_TIMESTAMP(qa.answers.date / 1000)::date AS date,
        qa.answers.answerer_name,
        qa.answers.helpfulness,
        (
          SELECT
            jsonb_agg(to_jsonb(photo_list))
          FROM
            (
              SELECT
                qa.answers_photos.id, qa.answers_photos.url
              FROM qa.answers_photos
              WHERE qa.answers_photos.answer_id = qa.answers.id
            ) AS photo_list
        ) AS photos
      FROM qa.answers
      WHERE question_id = ${question_id}
      LIMIT ${count};
    `);
    return data;
  } catch(err) {
    console.error('getAnswers Error', err);
  }
}

module.exports = { aggregate_getQuestions, aggregate_getAnswers }