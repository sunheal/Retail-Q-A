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

const getQuestions = () => {
  pool
    .query(`
      SELECT id
    `)
}

// const getAnswers = (question_id) => {
//   return
//     pool
//       .query(`
//         SELECT
//           id AS answer_id,
//           body,
//           date,
//           answerer_name,
//           helpfulness
//         FROM qa.answers
//         WHERE question_id = ${question_id}
//       `)
//       // .then(res => res.rows)
//       .catch(err => console.error('getAnswers Error', err))
// }

const getAnswers = async (question_id) => {
  try {
    const data = await pool.query(`
      SELECT
        answers.id AS answer_id,
        answers.body,
        answers.date,
        answers.answerer_name,
        answers.helpfulness,
        answers_photos.id as photo_id,
        answers_photos.url
      FROM qa.answers
      INNER JOIN qa.answers_photos
      ON answers.id = answers_photos.answer_id
      AND answers.question_id = ${question_id};
    `);
    return data;
  } catch(err) {
    console.error('getAnswers Error', err);
  }
}


module.exports.getAnswers = getAnswers;