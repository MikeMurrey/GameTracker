const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const { gameSchema } = require('../schemas.js');
const { isLoggedIn } = require('../middleware');

const ExpressError = require('../utils/ExpressError');
const Game = require('../models/game');

const validateGame = (req, res, next) => {
  const { error } = gameSchema.validate(req.body);
  if (error) {
    const message = error.details.map(el => el.message).join(',');
    throw new ExpressError(message, 400);
  } else {
    next();
  }
};

const isAuthor = async (req, res, next) => {
  const { id } = req.params;
  const currentGame = await Game.findById(id);
  if (!currentGame.author.equals(req.user._id)) {
    req.flash('error', 'You do not have permission to do that.');
    return res.redirect(`/games/${id}`);
  }
  next();
}


router.get('/', async (req, res) => {
  const games = await Game.find({});
  res.render('games/index', { games });
});

router.get('/new', isLoggedIn, (req, res) => {
  res.render('games/new');
});

router.post('/', isLoggedIn, validateGame, catchAsync(async (req, res, next) => {
  const game = new Game(req.body.game);
  game.author = req.user._id;
  await game.save();
  req.flash('success', 'Game added!');
  res.redirect(`/games/${game._id}`);
}));

router.get('/:id', catchAsync(async (req, res) => {
  const game = await Game.findById(req.params.id).populate('reviews').populate('author');
  if (!game) {
    req.flash('error', 'Game not found!');
    return res.redirect('/games');
  }
  res.render('games/show', { game });
}));

router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(async (req, res) => {
  const game = await Game.findById(req.params.id);
  if (!game) {
    req.flash('error', 'Game not found!');
    return res.redirect('/games');
  }
  res.render('games/edit', { game });
}));

router.put('/:id', isLoggedIn, isAuthor, validateGame, catchAsync(async (req, res) => {
  const { id } = req.params;
  const game = await Game.findByIdAndUpdate(id, { ...req.body.game });
  req.flash('success', 'Game info updated!');
  res.redirect(`/games/${game._id}`);
}));

router.delete('/:id', isLoggedIn, catchAsync(async (req, res) => {
  const { id } = req.params;
  await Game.findByIdAndDelete(id);
  req.flash('success', 'Deleted game successfully.')
  res.redirect('/games');
}));

module.exports = router;