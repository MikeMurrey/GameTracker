const express = require('express');
const router = express.Router();
const passport = require('passport');
const catchAsync = require('../utils/catchAsync');
const User = require('../models/user');
const { storeReturnTo } = require('../middleware');

router.get('/register', (req, res) => {
  res.render('users/register');
});

router.post('/register', catchAsync(async (req, res, next) => {
  try {
    const { email, username, password } = req.body;
    const user = new User({ email, username });
    const registeredUser = await User.register(user, password);
    req.login(registeredUser, err => {
      if (err) return next(err);
      req.flash('success', `Welcome to GameTracker, ${username}!`);
      res.redirect('/games');
    })
  } catch (e) {
    req.flash('error', e.message);
    res.redirect('register');
  }
}));

router.get('/login', (req, res) => {
  res.render('users/login');
});

router.post('/login', storeReturnTo, passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }), (req, res) => {
  const username = req.body.username;
  req.flash('success', `Welcome back, ${username}!`);
  const redirectUrl = res.locals.returnTo || '/games';
  res.redirect(redirectUrl);
});

router.get('/logout', (req, res, next) => {
  req.logout(function (err) {
    if (err) { return next(err); }
    req.flash('success', 'Logged Out.');
    res.redirect('/games');
  });
});

module.exports = router;