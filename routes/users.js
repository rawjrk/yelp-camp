const express = require('express');
const router = express.Router({ mergeParams: true });
const catchAsync = require('../utils/catchAsync');
const passport = require('passport');

const User = require('../models/user');

router.get('/register', (req, res) => {
  res.render('users/register');
});

router.post('/register', catchAsync(async (req, res, next) => {
  try {
    const { email, username, password } = req.body;
    const user = new User({ email, username });
    const registeredUser = await User.register(user, password);
    req.login(registeredUser, err => {
      if (err) return next();
      req.flash('success', 'Welcome to Yelp Camp!');
      res.redirect('/campgrounds');
    });
  } catch (err) {
    req.flash('error', err.message);
    res.redirect('register');
  }
}));

router.get('/login', (req, res) => {
  const returnTo = req.session.returnTo;
  delete req.session.returnTo;
  res.render('users/login', { returnTo });
});

router.post('/login', passport.authenticate('local', {
  failureFlash: true,
  failureRedirect: '/login',
}), (req, res) => {
  req.flash('success', 'Welcome back!');
  const redirectUrl = req.body._returnTo || '/campgrounds';
  res.redirect(redirectUrl);
});

router.get('/logout', (req, res, next) => {
  req.logout(err => {
    if (err) return next(err);
    req.flash('success', 'Logged you out successfully!');
    res.redirect('/campgrounds');
  });
});

module.exports = router;
