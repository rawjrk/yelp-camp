const express = require('express');
const router = express.Router({ mergeParams: true });
const passport = require('passport');
const users = require('../controllers/users');

router.route('/register')
    .get(users.renderRegisterForm)
    .post(users.registerUser);

const authConfig = { failureFlash: true, failureRedirect: '/login' };
router.route('/login')
    .get(users.renderLoginForm)
    .post(passport.authenticate('local', authConfig),
        users.loginSuccessfull);

router.get('/logout', users.logoutUser);

module.exports = router;
