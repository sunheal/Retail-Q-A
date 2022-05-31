const express = require('express');
const app = express();
const port = 3000;
const { getQuestions, getAnswers, getPhotos, postQuestion, postAnswer, postPhotos, markQuestionHelpful, markAnswerHelpful, reportQuestion, reportAnswer }= require('./PostgresSQL/database');

//express.json() and express.urlencoded() are built-in middleware functions to support JSON-encoded and URL-encoded bodies so that we could use req.body with POST Parameters
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const loadPhotosToAnswers = async (answers) => {
  const answer_ids = answers.map(answer => answer.answer_id);
  const photosArr = await Promise.all(answer_ids.map(answer_id => getPhotos(answer_id)));
  const photos = photosArr.map(photoObj => photoObj.rows);
  for (let i = 0; i < answers.length; i++) {
    answers[i].photos = photos[i];
  }
  return answers;
}

// app.get('/qa/questions/:product_id', async (req, res) => {
//   try {
//     const { product_id }= req.params;
//     const questionsData = await getQuestions(product_id);
//     const questions = questionsData.rows;
//     const question_ids = questions.map(question => question.question_id);
//     const answersData = await Promise.all(question_ids.map(question_id => getAnswers(question_id)));
//     const answersArr = answersData.map(answerObj => answerObj.rows);
//     const answersWithPhotos = await Promise.all(answersArr.map(answers => loadPhotosToAnswers(answers)));
//     for (let i = 0; i < questions.length; i++) {
//       questions[i].answers = {};
//       for (let answersWithPhoto of answersWithPhotos[i]) {
//         questions[i].answers[answersWithPhoto.answer_id] = answersWithPhoto;
//       }
//     }
//     res.status(200).send(questions);
//   } catch(err) {
//     console.error(err);
//     res.status(500).send('server get questions error');
//   }
// });


// What is query param PAGE about?????
app.get('/qa/questions/', async (req, res) => {
  try {
    let { product_id, page, count } = req.query;
    if (!count) {
      count = 5;
    }
    const questionsData = await getQuestions(product_id, count);
    const questions = { product_id };
    questions.results = questionsData.rows;
    const question_ids = questions.results.map(question => question.question_id);
    const answersData = await Promise.all(question_ids.map(question_id => getAnswers(question_id)));
    const answersArr = answersData.map(answerObj => answerObj.rows);
    const answersWithPhotos = await Promise.all(answersArr.map(answers => loadPhotosToAnswers(answers)));
    for (let i = 0; i < questions.results.length; i++) {
      questions.results[i].answers = {};
      for (let answersWithPhoto of answersWithPhotos[i]) {
        questions.results[i].answers[answersWithPhoto.answer_id] = answersWithPhoto;
      }
    }
    res.status(200).send(questions);
  } catch(err) {
    console.error(err);
    res.status(500).send('server get questions error');
  }
});

// What is query param PAGE about?????
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
    const answers = {question: question_id, page, count};
    const answersData = await getAnswers(question_id, count);
    const answerWithoutPhotos = answersData.rows;
    answers.results = await loadPhotosToAnswers(answerWithoutPhotos);
    res.status(200).send(answers);
  } catch(err) {
    console.error(err);
    res.status(500).send('server get answers error');
  }
});

app.post('/qa/questions', async (req, res) => {
  try {
    const { product_id, body, name, email } = req.body;
    const data = await postQuestion(product_id, body, name, email);
    const postedQuestion = data.rows[0];
    res.status(201).send(postedQuestion);
  } catch(err) {
    console.error(err);
    res.status(500).send('server post question error');
  }
});

app.post('/qa/questions/:question_id/answers', async (req, res) => {
  try {
    const { question_id } = req.params;
    const { body, name, email, photos } = req.body;
    const answerData = await postAnswer(question_id, body, name, email);
    const answer = answerData.rows[0];
    const answer_id = answer.id;
    const answers_photosData = await Promise.all(photos.map(photoUrl => postPhotos(answer_id, photoUrl)));
    answer.photos = answers_photosData.map(answers_photoData => answers_photoData.rows[0]);
    res.status(201).send(answer);
  } catch(err) {
    console.error(err);
    res.status(500).send('server post answer error');
  }
});

app.put('/qa/questions/:question_id/helpful', async (req, res) => {
  try {
    const { question_id } = req.params;
    await markQuestionHelpful(question_id);
    res.status(204).send(`Question Id ${question_id} Marked Helpful`);
  } catch(err) {
    console.error(err);
    res.status(500).send('server put question helpful error');
  }
});

app.put('/qa/answers/:answer_id/helpful', async (req, res) => {
  try {
    const { answer_id } = req.params;
    await markAnswerHelpful(answer_id);
    res.status(204).send(`Answer Id ${answer_id} Marked Helpful`);
  } catch(err) {
    console.error(err);
    res.status(500).send('server put question helpful error');
  }
});

app.put('/qa/questions/:question_id/report', async (req, res) => {
  try {
    const { question_id } = req.params;
    await reportQuestion(question_id);
    res.status(204).send();
  } catch(err) {
    console.error(err);
    res.status(500).send('server put question reported error');
  }
});

app.put('/qa/answers/:answer_id/report', async (req, res) => {
  try {
    const { answer_id } = req.params;
    await reportAnswer(answer_id);
    res.status(204).send();
  } catch(err) {
    console.error(err);
    res.status(500).send('server put answer reported error');
  }
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`)});