const mongoose = require('mongoose');
const { Schema } = mongoose;

const uri = 'mongodb://localhost/SDC';

mongoose.connect(uri);

const questionsSchema = new Schema({
  question_id: Schema.Types.ObjectID,
  question_body: String,
  question_date: Date,
  asker_name: String,
  question_helpfulness: Number,
  reported: Boolean,
  answers: [{
    type: Schema.Types.ObjectID,
    ref: 'Answers'
  }]
});

const answersSchema = new Schema({
  id: Schema.Types.ObjectID,
  body: String,
  date: Date,
  answerer_name: String,
  helpfulness: Number,
  photos: [{
    type: Schema.Types.ObjectID,
    ref: 'Photos'
  }]
});

const photosSchema = new Schema({
  photo_id: Schema.Types.ObjectID,
  url: String,
});

const Questiions = mongoose.model('Questiions', questionsSchema);
const Answers = mongoose.model('Answers', answersSchema);
const Photos = mongoose.model('Photos', photosSchema);