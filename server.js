const express = require('express');
const app = express();
const port = 3000;
const { getAnswersAndPhotos, getAnswers, getPhotos }= require('./PostgresSQL/database');

//express.json() and express.urlencoded() are built-in middleware functions to support JSON-encoded and URL-encoded bodies so that we could use req.body with POST Parameters
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/qa/questions/:question_id/answers', async (req, res) => {
  try {
    const { question_id }= req.params;
    let { page, count } = req.query;
    if (!page) {
      page = 1;
    }
    if (!count) {
      count = 5;
    }
    // const data = await getAnswersAndPhotos(question_id)
    const answers = await getAnswers(question_id);
    const answer_ids = answers.rows.map(answer => answer.answer_id);
    const photosPromise = Promise.all(answer_ids.map(answer_id => getPhotos(answer_id)));
    const photosArr = await photosPromise;
    const photos = photosArr.map(photoObj => photoObj.rows);
    for (let i = 0; i < answers.rows.length; i++) {
      answers.rows[i].photos = photos[i];
    }
    res.status(200).send(answers.rows);
  } catch(err) {
    console.error(err);
    res.status(500).send('server get answers error');
  }
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`)});