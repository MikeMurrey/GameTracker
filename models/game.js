const mongoose = require('mongoose');
const Review = require('./review');
const Schema = mongoose.Schema;

const GameSchema = new Schema({
  title: String,
  image: String,
  platform: String,
  year: Number,
  note: String,
  reviews: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Review'
    }
  ]
});

GameSchema.post('findOneAndDelete', async function (doc) {
  if (doc) {
    await Review.deleteMany({
      _id: {
        $in: doc.reviews
      }
    })
  }
})

module.exports = mongoose.model('Game', GameSchema);