var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Entry = new Schema({
  title: {
    type: String,
    required: true,
    min: 3,
    max: 24
  },
  body: {
    type: String,
    required: true,
    min: 3,
    max: 200
  },
  user: {
    type: String,
    required: true,
    max: 16
  },
  votes: {
    type: [ {userId: String, rate: Number} ],
    required: true,
    default: [],
  },
  voteRate: {
    type: Number,
    required: true,
    default: 0
  },
  date: {
    type: Date,
    default: new Date(),
  }
});


module.exports = mongoose.model('Entry', Entry);
