const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const GameSchema = new Schema({
  title: String,
  system: String,
  year: Number,
});

module.exports = mongoose.model('Game', GameSchema);