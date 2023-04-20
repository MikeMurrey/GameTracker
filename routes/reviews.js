const express = require('express');
const router = express.Router({ mergeParams: true });

const { validateReview, isLoggedIn, isReviewAuthor } = require('../middleware');

const Game = require('../models/game');
const Review = require('../models/review');

const catchAsync = require('../utils/catchAsync');

router.post('/', isLoggedIn, validateReview, catchAsync(async (req, res) => {
  const game = await Game.findById(req.params.id);
  const review = new Review(req.body.review);
  review.author = req.user._id;
  game.reviews.push(review);
  await review.save();
  await game.save();
  req.flash('success', 'Posted new review!')
  res.redirect(`/games/${game._id}`);
}));

router.delete('/:reviewId', isLoggedIn, isReviewAuthor, catchAsync(async (req, res) => {
  const { id, reviewId } = req.params;
  await Game.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
  await Review.findByIdAndDelete(reviewId);
  req.flash('success', 'Review deleted successfully.')
  res.redirect(`/games/${id}`);
}));

module.exports = router;