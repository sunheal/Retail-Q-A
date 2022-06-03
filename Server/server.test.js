const request = require('supertest');
const app = require('./server');
const { pool }= require('../PostgresSQL/database');

afterAll(async () => {
  await pool.end();
});

describe('GET /qa/questions/', () => {
  it('should respond with status 200', async () => {
    const response = await request(app).get('/qa/questions/?product_id=5')
    expect(response.status).toEqual(200);
  });

  it('should respond with an object that has the same product_id as req.query', async () => {
    const response = await request(app).get('/qa/questions/?product_id=5')
    expect(response.body.product_id).toBe('5');
  });

  it('should respond with an object that has questions and answers related to the provided product_id', async () => {
    const response = await request(app).get('/qa/questions/?product_id=5')
    expect(response.body.results.length).toBeGreaterThanOrEqual(0);
    expect(response.body.results[0].question_id).toBeGreaterThan(0);
    expect(response.body.results[0].answers).toBeDefined();
  });

  it('should respond with specific number of questions when req.query.count is provided', async () => {
    const response = await request(app).get('/qa/questions/?product_id=5&count=1')
    expect(response.body.results.length).toEqual(1);
  });

  it('should respond with maximum 5 questions when req.query.count is NOT provided', async () => {
    const response = await request(app).get('/qa/questions/?product_id=5')
    expect(response.body.results.length).toBeLessThanOrEqual(5);
  });
});

describe('GET /qa/questions/:question_id/answers', () => {
  it('should respond with status 200', async () => {
    const response = await request(app).get('/qa/questions/5/answers')
    expect(response.status).toEqual(200);
  });

  it('should respond with an object that has the same question_id as req.param', async () => {
    const response = await request(app).get('/qa/questions/5/answers')
    expect(response.body.question).toBe('5');
  });

  it('should respond with an object that has answers related to the provided question_id', async () => {
    const response = await request(app).get('/qa/questions/5/answers')
    expect(response.body.results.length).toBeGreaterThanOrEqual(0);
    expect(response.body.results[0].answer_id).toBeGreaterThan(0);
    expect(response.body.results[0].photos).toBeDefined();
  });

  it('should respond with specific number of answers when req.query.count is provided', async () => {
    const response = await request(app).get('/qa/questions/5/answers?count=1')
    expect(response.body.results.length).toEqual(1);
  });

  it('should respond with smaximum 5 questions when req.query.count is NOT provided', async () => {
    const response = await request(app).get('/qa/questions/5/answers')
    expect(response.body.results.length).toBeLessThanOrEqual(5);
  });
});