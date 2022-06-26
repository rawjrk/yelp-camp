const express = require('express');
const router = express.Router({ mergeParams: true });
const passport = require('passport');
const users = require('../controllers/users');

router.get('/register', users.renderRegisterForm);

router.post('/register', users.registerUser);

router.get('/login', users.renderLoginForm);

router.post('/login',
    passport.authenticate('local', {
      failureFlash: true,
      failureRedirect: '/login',
    }),
    users.loginSuccessfull);

router.get('/logout', users.logoutUser);

module.exports = router;
