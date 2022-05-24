const express = require('express');
const app = express();
const port = 3000;
const { getAnswers }= require('./PostgresSQL/database');

//express.json() and express.urlencoded() are built-in middleware functions to support JSON-encoded and URL-encoded bodies so that we could use req.body with POST Parameters
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// app.get('/qa/questions/:question_id/answers', (req, res) => {
//   const question_id = req.params.question_id;
//   getAnswers(question_id)
//     .then(data => res.send(data.rows))
//     .catch(err => console.error('server get answers error', err));
// });

app.get('/qa/questions/:question_id/answers', async (req, res) => {
  try {
    const { question_id }= req.params;
    const data = await getAnswers(question_id)
    res.status(200).send(data.rows);
  } catch(err) {
    console.error(err);
    res.status(500).send('server get answers error');
  }
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`)});