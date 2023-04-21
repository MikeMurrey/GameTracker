const mongoose = require('mongoose');
const Review = require('./review');
const Schema = mongoose.Schema;

const GameSchema = new Schema({
  title: String,
  images: [
    {
      url: String,
      filename: String
    }
  ],
  platform: String,
  year: Number,
  note: String,
  author: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
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