const express = require('express');
const router = express.Router();
const gameController = require('../controllers/games');
const catchAsync = require('../utils/catchAsync');
const { isLoggedIn, isAuthor, validateGame } = require('../middleware');


router.get('/', catchAsync(gameController.index));

router.get('/new', isLoggedIn, gameController.renderNewForm);

router.post('/', isLoggedIn, validateGame, catchAsync(gameController.createGame));

router.get('/:id', catchAsync(gameController.showGame));

router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(gameController.renderEditForm));

router.put('/:id', isLoggedIn, isAuthor, validateGame, catchAsync(gameController.updateGame));

router.delete('/:id', isLoggedIn, isAuthor, catchAsync(gameController.deleteGame));

module.exports = router;