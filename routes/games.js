const express = require('express');
const router = express.Router();
const gameController = require('../controllers/games');
const catchAsync = require('../utils/catchAsync');
const { isLoggedIn, isAuthor, validateGame } = require('../middleware');
const multer = require('multer');
const { storage } = require('../cloudinary');
const upload = multer({ storage });


router.route('/')
  .get(catchAsync(gameController.index))
  .post(isLoggedIn, upload.array('image'), validateGame, catchAsync(gameController.createGame));


router.get('/new', isLoggedIn, gameController.renderNewForm);

router.route('/:id')
  .get(catchAsync(gameController.showGame))
  .put(isLoggedIn, isAuthor, upload.array('image'), validateGame, catchAsync(gameController.updateGame))
  .delete(isLoggedIn, isAuthor, catchAsync(gameController.deleteGame));

router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(gameController.renderEditForm));

module.exports = router;