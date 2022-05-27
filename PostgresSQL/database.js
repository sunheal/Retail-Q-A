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

const getQuestions = async (product_id) => {
  try {
    const data = await pool.query(`
      SELECT
        id AS question_id,
        body AS question_body,
        TO_TIMESTAMP(date / 1000)::date AS question_date,
        asker_name,
        helpfulness AS question_helpfulness,
        reported
      FROM qa.questions
      WHERE product_id = ${product_id};
    `);
    return data;
  } catch (err) {
    console.error('getQuestions Error', err);
  }
}

const getAnswersAndPhotos = async (question_id) => {
  try {
    const data = await pool.query(`
      SELECT
        answers.id AS answer_id,
        answers.body,
        TO_TIMESTAMP(answers.date / 1000)::date AS date,
        answers.answerer_name,
        answers.helpfulness,
        answers_photos.id as photo_id,
        answers_photos.url
      FROM qa.answers
      LEFT JOIN qa.answers_photos
      ON answers.id = answers_photos.answer_id
      WHERE answers.question_id = ${question_id};
    `);
    return data;
  } catch(err) {
    console.error('getAnswersAndPhotos Error', err);
  }
}

const getAnswers = async (question_id) => {
  try {
    const data = await pool.query(`
      SELECT
        id AS answer_id,
        body,
        TO_TIMESTAMP(date / 1000)::date AS date,
        answerer_name,
        helpfulness
      FROM qa.answers
      WHERE question_id = ${question_id};
    `);
    return data;
  } catch(err) {
    console.error('getAnswers Error', err);
  }
}

const getPhotos = async (answer_id) => {
  try {
    const data = await pool.query(`
    SELECT id , url
    FROM qa.answers_photos
    WHERE answer_id = ${answer_id};
    `);
    return data;
  } catch(err) {
    console.error('getPhotos Error', err);
  }
}

const postQuestion = async (product_id, body, asker_name, asker_email) => {
  try {
    const text = 'INSERT INTO qa.questions(product_id, body, date, asker_name, asker_email) VALUES($1, $2, $3, $4, $5) RETURNING *';
    const values = [product_id, body, Date.now(), asker_name, asker_email]
    const data = await pool.query(text, values);
    return data;
  } catch (err) {
    console.error('postQuestion Error', err);
  }
}

// module.exports.getAnswersAndPhotos = getAnswersAndPhotos;
module.exports = { getQuestions, getAnswersAndPhotos, getAnswers, getPhotos, postQuestion }