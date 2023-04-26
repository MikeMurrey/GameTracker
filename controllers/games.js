const Game = require('../models/game');
const { cloudinary } = require('../cloudinary');

module.exports.index = async (req, res) => {
  const games = await Game.find({});
  res.render('games/index', { games });
};

module.exports.renderNewForm = (req, res) => {
  res.render('games/new');
};

module.exports.createGame = async (req, res, next) => {
  const game = new Game(req.body.game);
  game.images = req.files.map(f => ({ url: f.path, filename: f.filename }));
  game.author = req.user._id;
  await game.save();
  console.log(game);
  req.flash('success', 'Game added!');
  res.redirect(`/games/${game._id}`);
};

module.exports.showGame = async (req, res) => {
  const game = await Game.findById(req.params.id).populate({
    path: 'reviews',
    populate: {
      path: 'author'
    }
  }).populate('author');
  if (!game) {
    req.flash('error', 'Game not found!');
    return res.redirect('/games');
  }
  res.render('games/show', { game });
};

module.exports.renderEditForm = async (req, res) => {
  const game = await Game.findById(req.params.id);
  if (!game) {
    req.flash('error', 'Game not found!');
    return res.redirect('/games');
  }
  res.render('games/edit', { game });
};

module.exports.updateGame = async (req, res) => {
  const { id } = req.params;
  const game = await Game.findByIdAndUpdate(id, { ...req.body.game });
  if (req.files.length > 0) {
    const imgs = req.files.map(f => ({ url: f.path, filename: f.filename }));
    game.images.push(...imgs);
  }
  await game.save();
  if (req.body.deleteImages) {
    for (let filename of req.body.deleteImages) {
      await cloudinary.uploader.destroy(filename);
    }
    await game.updateOne({ $pull: { images: { filename: { $in: req.body.deleteImages } } } })
  }
  req.flash('success', 'Game info updated!');
  res.redirect(`/games/${game._id}`);
};

module.exports.deleteGame = async (req, res) => {
  const { id } = req.params;
  const game = await Game.findByIdAndDelete(id);
  for (let image of game.images) {
    await cloudinary.uploader.destroy(image.filename);
  }
  req.flash('success', 'Deleted game successfully.')
  res.redirect('/games');
};