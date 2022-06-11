const request = require('supertest');
const app = require('./server');
const { pool }= require('../PostgresSQL/database');

afterAll(async () => {
  await pool.end();
});

describe('GET /qa/questions/', () => {
  const test_product_id = 5;
  const invalid_product_id = 'a';
  it('should respond with status 200', async () => {
    const response = await request(app).get(`/qa/questions/?product_id=${test_product_id}`);
    expect(response.status).toEqual(200);
  });

  it('should respond with an object that has the same product_id as req.query', async () => {
    const response = await request(app).get(`/qa/questions/?product_id=${test_product_id}`);
    expect(response.body.product_id).toBe(`${test_product_id}`);
  });

  it('should respond with an object that has questions and answers related to the provided product_id', async () => {
    const response = await request(app).get(`/qa/questions/?product_id=${test_product_id}`);
    expect(response.body.results.length).toBeGreaterThanOrEqual(0);
    expect(response.body.results[0].question_id).toBeGreaterThan(0);
    expect(response.body.results[0].question_body).toBeDefined();
    expect(response.body.results[0].question_date).toBeDefined();
    expect(response.body.results[0].asker_name).toBeDefined();
    expect(response.body.results[0].question_helpfulness).toBeGreaterThanOrEqual(0);
    expect(response.body.results[0].reported).toBeDefined();
    expect(response.body.results[0].answers).toBeDefined();
  });

  it('should respond with specific number of questions when req.query.count is provided', async () => {
    const response = await request(app).get(`/qa/questions/?product_id=${test_product_id}&count=1`);
    expect(response.body.results.length).toEqual(1);
  });

  it('should respond with maximum 5 questions when req.query.count is NOT provided', async () => {
    const response = await request(app).get(`/qa/questions/?product_id=${test_product_id}`);
    expect(response.body.results.length).toBeLessThanOrEqual(test_product_id);
  });

  it('should respond with error when product_id is invalid', async () => {
    const response = await request(app).get(`/qa/questions/?product_id=${invalid_product_id}`);
    expect(response.status).toEqual(500);
    expect(response.text).toEqual('server get questions error');
  });
});

describe('GET /qa/questions/:question_id/answers', () => {
  const test_question_id = 5;
  const invalid_question_id = 'b';
  it('should respond with status 200', async () => {
    const response = await request(app).get(`/qa/questions/${test_question_id}/answers`);
    expect(response.status).toEqual(200);
  });

  it('should respond with an object that has the same question_id as req.param', async () => {
    const response = await request(app).get(`/qa/questions/${test_question_id}/answers`);
    expect(response.body.question).toBe(`${test_question_id}`);
  });

  it('should respond with an object that has answers related to the provided question_id', async () => {
    const response = await request(app).get(`/qa/questions/${test_question_id}/answers`);
    expect(response.body.results.length).toBeGreaterThanOrEqual(0);
    expect(response.body.results[0].answer_id).toBeGreaterThan(0);
    expect(response.body.results[0].body).toBeDefined();
    expect(response.body.results[0].date).toBeDefined();
    expect(response.body.results[0].answerer_name).toBeDefined();
    expect(response.body.results[0].helpfulness).toBeGreaterThanOrEqual(0);
    expect(response.body.results[0].photos).toBeDefined();
  });

  it('should respond with specific number of answers when req.query.count is provided', async () => {
    const response = await request(app).get(`/qa/questions/${test_question_id}/answers?count=1`);
    expect(response.body.results.length).toEqual(1);
  });

  it('should respond with maximum 5 questions when req.query.count is NOT provided', async () => {
    const response = await request(app).get(`/qa/questions/${test_question_id}/answers`);
    expect(response.body.results.length).toBeLessThanOrEqual(test_question_id);
  });

  it('should respond with error when question_id is invalid', async () => {
    const response = await request(app).get(`/qa/questions/${invalid_question_id}/answers`);
    expect(response.status).toEqual(500);
    expect(response.text).toEqual('server get answers error');
  });
});

describe('POST /qa/questions', () => {
  const testData = {
    product_id: 100,
    body: 'Test post question to product_id 100',
    name: 'sunheal_the_tester',
    email: 'sunheal_the_tester@gmail.com'
  }
  const invalid_data = {invalidKey: 'invalidValue'}

  afterEach(async () => {
    // Delete all questions posted by testData.name
    await pool.query(`DELETE FROM qa.questions WHERE asker_name = '${testData.name}'`);
  });

  it('should post the testData to db and respond with status 201 and the posted question', async () => {

    // Check response
    const response = await request(app)
      .post('/qa/questions')
      .send(testData);
    expect(response.status).toEqual(201);
    expect(response.body.product_id).toBe(testData.product_id);
    expect(response.body.body).toBe(testData.body);
    expect(response.body.asker_name).toBe(testData.name);
    expect(response.body.asker_email).toBe(testData.email);
    expect(response.body.reported).toBe(false);
    expect(response.body.helpfulness).toEqual(0);

    // Check db
    const dbData = await pool.query(`SELECT * FROM qa.questions WHERE asker_name = '${testData.name}'`);
    expect(dbData.rows[0].product_id).toBe(testData.product_id);
    expect(dbData.rows[0].body).toBe(testData.body);
    expect(dbData.rows[0].asker_name).toBe(testData.name);
    expect(dbData.rows[0].asker_email).toBe(testData.email);
    expect(dbData.rows[0].reported).toBe(false);
    expect(dbData.rows[0].helpfulness).toEqual(0);
  });

  it('should return error when invalid_data is posted', async () => {
    const response = await request(app)
      .post('/qa/questions')
      .send(invalid_data);
      expect(response.status).toEqual(500);
      expect(response.text).toEqual('server post question error');
  });
});

describe('POST /qa/questions/:question_id/answers', () => {
  const test_question_id = 200;
  const invalid_question_id = 'c';
  const testData = {
    body: `Test post answer to question_id ${test_question_id}`,
    name: 'sunheal_the_tester',
    email: 'sunheal_the_tester@gmail.com',
    photos: ['http://test1.com']
  }
  const invalid_data = {invalidKey: 'invalidValue'};
  let test_answer_id;

  afterEach(async () => {
    // Delete all questions and photos posted by testData.name
    await pool.query(`DELETE FROM qa.answers_photos WHERE answer_id = ${test_answer_id};`);
    await pool.query(`DELETE FROM qa.answers WHERE answerer_name = '${testData.name}';`);
  });

  it('should post the testData to db and respond with status 201 and the posted answer', async () => {

    // Check response
    const response = await request(app)
      .post(`/qa/questions/${test_question_id}/answers`)
      .send(testData);
    expect(response.status).toEqual(201);
    expect(response.body.question_id).toEqual(test_question_id);
    expect(response.body.body).toBe(testData.body);
    expect(response.body.answerer_name).toBe(testData.name);
    expect(response.body.answerer_email).toBe(testData.email);
    expect(response.body.reported).toBe(false);
    expect(response.body.helpfulness).toEqual(0);
    expect(response.body.photos[0].url).toEqual(testData.photos[0]);

    // Check db
    const dbData = await pool.query(`
      SELECT
        qa.answers.id,
        qa.answers.question_id,
        qa.answers.body,
        qa.answers.answerer_name,
        qa.answers.answerer_email,
        qa.answers.reported,
        qa.answers.helpfulness,
        qa.answers_photos.answer_id,
        qa.answers_photos.url
      FROM
        qa.answers
      INNER JOIN
        qa.answers_photos
      ON
        qa.answers.answerer_name = '${testData.name}'
      AND
        qa.answers.id = qa.answers_photos.answer_id;
    `);
    test_answer_id = dbData.rows[0].id;
    expect(dbData.rows[0].question_id).toEqual(test_question_id);
    expect(dbData.rows[0].body).toBe(testData.body);
    expect(dbData.rows[0].answerer_name).toBe(testData.name);
    expect(dbData.rows[0].answerer_email).toBe(testData.email);
    expect(dbData.rows[0].reported).toBe(false);
    expect(dbData.rows[0].helpfulness).toEqual(0);
    expect(dbData.rows[0].url).toEqual(testData.photos[0]);
  });

  it('should return error when invalid_data is posted', async () => {
    const response = await request(app)
      .post(`/qa/questions/${invalid_question_id}/answers`)
      .send(invalid_data);
      expect(response.status).toEqual(500);
      expect(response.text).toEqual('server post answer error');
  });
});

describe('PUT /qa/questions/:question_id/helpful', () => {
  const test_question_id = 300;
  let helpfulness_before_test;

  beforeEach(async () => {
    const data_before_test = await pool.query(`SELECT helpfulness FROM qa.questions WHERE id = ${test_question_id}`);
    helpfulness_before_test = data_before_test.rows[0].helpfulness;
  })

  afterEach(async () => {
    // Reset helpfulness to helpfulness_before_test
    await pool.query(`UPDATE qa.questions SET helpfulness = ${helpfulness_before_test} WHERE id = ${test_question_id};`);
  });

  it('should increment the question\'s helpfulness and respond with a 204 status', async () => {

    // Check response
    const response = await request(app).put(`/qa/questions/${test_question_id}/helpful`);
    expect(response.status).toEqual(204);

    // Check db
    const data_after_test = await pool.query(`SELECT helpfulness FROM qa.questions WHERE id = ${test_question_id}`);
    const helpfulness_after_test = data_after_test.rows[0].helpfulness;
    expect(helpfulness_after_test).toEqual(helpfulness_before_test + 1);
  });
});

describe('PUT /qa/answers/:answer_id/helpful', () => {
  const test_answer_id = 400;
  let helpfulness_before_test;

  beforeEach(async () => {
    const data_before_test = await pool.query(`SELECT helpfulness FROM qa.answers WHERE id = ${test_answer_id}`);
    helpfulness_before_test = data_before_test.rows[0].helpfulness;
  })

  afterEach(async () => {
    // Reset helpfulness to helpfulness_before_test
    await pool.query(`UPDATE qa.answers SET helpfulness = ${helpfulness_before_test} WHERE id = ${test_answer_id};`);
  });

  it('should increment the answer\'s helpfulness and respond with a 204 status', async () => {

    // Check response
    const response = await request(app).put(`/qa/answers/${test_answer_id}/helpful`);
    expect(response.status).toEqual(204);

    // Check db
    const data_after_test = await pool.query(`SELECT helpfulness FROM qa.answers WHERE id = ${test_answer_id}`);
    const helpfulness_after_test = data_after_test.rows[0].helpfulness;
    expect(helpfulness_after_test).toEqual(helpfulness_before_test + 1);
  });
});

describe('PUT /qa/questions/:question_id/report', () => {
  const test_question_id = 300;
  let reported_before_test;

  beforeEach(async () => {
    const data_before_test = await pool.query(`SELECT reported FROM qa.questions WHERE id = ${test_question_id}`);
    reported_before_test = data_before_test.rows[0].reported;
  })

  afterEach(async () => {
    // Reset reported to false
    await pool.query(`UPDATE qa.questions SET reported = false WHERE id = ${test_question_id};`);
  });

  it('should mark a question\'s reported to true and respond with a 204 status', async () => {

    // Check response
    const response = await request(app).put(`/qa/questions/${test_question_id}/report`);
    expect(response.status).toEqual(204);

    // Check db
    const data_after_test = await pool.query(`SELECT reported FROM qa.questions WHERE id = ${test_question_id}`);
    const reported_after_test = data_after_test.rows[0].reported;
    expect(reported_after_test).toBe(true);
  });
});

describe('put /qa/answers/:answer_id/report', () => {
  const test_answer_id = 400;
  let reported_before_test;

  beforeEach(async () => {
    const data_before_test = await pool.query(`SELECT reported FROM qa.answers WHERE id = ${test_answer_id}`);
    reported_before_test = data_before_test.rows[0].reported;
  })

  afterEach(async () => {
    // Reset reported to false
    await pool.query(`UPDATE qa.answers SET reported = false WHERE id = ${test_answer_id};`);
  });

  it('should mark a answer\'s reported to true and respond with a 204 status', async () => {

    // Check response
    const response = await request(app).put(`/qa/answers/${test_answer_id}/report`);
    expect(response.status).toEqual(204);

    // Check db
    const data_after_test = await pool.query(`SELECT reported FROM qa.answers WHERE id = ${test_answer_id}`);
    const reported_after_test = data_after_test.rows[0].reported;
    expect(reported_after_test).toBe(true);
  });
});