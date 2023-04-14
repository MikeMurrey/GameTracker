const express = require('express');
const router = express.Router({ mergeParams: true });

const Game = require('../models/game');
const Review = require('../models/review');

const { reviewSchema } = require('../schemas.js');

const ExpressError = require('../utils/ExpressError');
const catchAsync = require('../utils/catchAsync');

const validateReview = (req, res, next) => {
  const { error } = reviewSchema.validate(req.body);
  if (error) {
    const message = error.details.map(el => el.message).join(',');
    throw new ExpressError(message, 400);
  } else {
    next();
  }
};

router.post('/', validateReview, catchAsync(async (req, res) => {
  const game = await Game.findById(req.params.id);
  const review = new Review(req.body.review);
  game.reviews.push(review);
  await review.save();
  await game.save();
  req.flash('success', 'Posted new review!')
  res.redirect(`/games/${game._id}`);
}));

router.delete('/:reviewId', catchAsync(async (req, res) => {
  const { id, reviewId } = req.params;
  await Game.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
  await Review.findByIdAndDelete(reviewId);
  req.flash('success', 'Review deleted successfully.')
  res.redirect(`/games/${id}`);
}));

module.exports = router;