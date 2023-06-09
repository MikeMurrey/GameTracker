const Game = require('../models/game');
const Review = require('../models/review');

module.exports.createReview = async (req, res) => {
  const game = await Game.findById(req.params.id);
  const review = new Review(req.body.review);
  review.author = req.user._id;
  game.reviews.push(review);
  await review.save();
  await game.save();
  req.flash('success', 'Posted new review!')
  res.redirect(`/games/${game._id}`);
};

module.exports.deleteReview = async (req, res) => {
  const { id, reviewId } = req.params;
  await Game.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
  await Review.findByIdAndDelete(reviewId);
  req.flash('success', 'Review deleted successfully.')
  res.redirect(`/games/${id}`);
};