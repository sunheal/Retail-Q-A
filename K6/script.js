import http from 'k6/http';
import { check, group, sleep } from 'k6';

export const options = {
  vus: 1000,
  duration: '1m'
}

export default () => {
  group('get questions API', () => {
    const uri = 'http://localhost:3000/qa/questions/';
    let randomProduct_id = Math.floor(Math.random() *  100000) + 900000; //select the last 10% of product_ids, there are 1 million product_ids
    http.get(`${uri}?product_id=${randomProduct_id}`);
  });

  group('get answers API', () => {
    let randomQuestion_id = Math.floor(Math.random() *  351896) + 3167000; //select the last 10% of question_ids, there are 3518963 question_ids
    const url = `http://localhost:3000/qa/questions/${randomQuestion_id}/answers`;
    const res = http.get(url);
  });

  group('post questions API', () => {
    const url = 'http://localhost:3000/qa/questions/';
    let randomProduct_id = Math.floor(Math.random() *  1000000);
    const data = {
      product_id: randomProduct_id,
      body: `k6 post questions test product_id = ${randomProduct_id}`,
      name: 'k6_tester',
      email: 'k6_tester@gmail.com'
    }
    http.post(url, data);
  });

  group('post answers API', () => {
    const randomQuestion_id = Math.floor(Math.random() *  3518963);
    const url = `http://localhost:3000/qa/questions/${randomQuestion_id}/answers`;
    const data = {
      body: `k6 post answers test question_id = ${randomQuestion_id}`,
      name: 'k6_tester',
      email: 'k6_tester@gmail.com',
      photos: [`http//${randomQuestion_id}/1`, `http//${randomQuestion_id}/2`]
    }
    const res = http.post(url, data);
  });

  sleep(1);
}
