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

const getQuestions = async (product_id, count) => {
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
      WHERE product_id = ${product_id}
      LIMIT ${count};
    `);
    return data;
  } catch (err) {
    console.error('getQuestions Error', err);
  }
}

const getAnswers = async (question_id, count) => {
  try {
    if (!count) {
      count = 50;
    }
    const data = await pool.query(`
      SELECT
        id AS answer_id,
        body,
        TO_TIMESTAMP(date / 1000)::date AS date,
        answerer_name,
        helpfulness
      FROM qa.answers
      WHERE question_id = ${question_id}
      LIMIT ${count};
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
  } catch(err) {
    console.error('postQuestion Error', err);
  }
}

const postAnswer = async (question_id, body, answerer_name, answerer_email) => {
  try {
    const text = 'INSERT INTO qa.answers(question_id, body, date, answerer_name, answerer_email) VALUES($1, $2, $3, $4, $5) RETURNING *';
    const values = [question_id, body, Date.now(), answerer_name, answerer_email];
    const data = await pool.query(text, values);
    return data;
  } catch(err) {
    console.error('postAnswer Error', err);
  }
}

const postPhotos = async (answer_id, url) => {
  try {
    const text = 'INSERT INTO qa.answers_photos(answer_id, url) VALUES($1, $2) RETURNING id, url';
    const values = [answer_id, url];
    const data = await pool.query(text, values);
    return data;
  } catch(err) {
    console.error('postPhotos Error', err);
  }
}

const markQuestionHelpful = async (question_id) => {
  try {
    const text = 'UPDATE qa.questions SET helpfulness = helpfulness + 1 WHERE id = $1 RETURNING *';
    const values = [question_id];
    await pool.query(text, values);
  } catch (err) {
    console.error('markQuestionHelpful Error', err);
  }
}

const markAnswerHelpful = async (answer_id) => {
  try {
    const text = 'UPDATE qa.answers SET helpfulness = helpfulness + 1 WHERE id = $1 RETURNING *';
    const values = [answer_id];
    await pool.query(text, values);
  } catch (err) {
    console.error('markAnswerHelpful Error', err);
  }
}

const reportQuestion = async (question_id) => {
  try {
    const text = 'UPDATE qa.questions SET reported = true WHERE id = $1 RETURNING *';
    const values = [question_id];
    await pool.query(text, values);
  } catch(err) {
    console.error('reportQuestion Error', err)
  }
}

const reportAnswer = async (answer_id) => {
  try {
    const text = 'UPDATE qa.answers SET reported = true WHERE id = $1 RETURNING *';
    const values = [answer_id];
    await pool.query(text, values);
  } catch(err) {
    console.error('reportAnswer Error', err)
  }
}

module.exports = { getQuestions, getAnswers, getPhotos, postQuestion, postAnswer, postPhotos, markQuestionHelpful, markAnswerHelpful, reportQuestion, reportAnswer }