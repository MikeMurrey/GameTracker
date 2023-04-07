const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const GameSchema = new Schema({
  title: String,
  image: String,
  platform: String,
  year: Number,
  favorite: Boolean,
  note: String
});

module.exports = mongoose.model('Game', GameSchema);