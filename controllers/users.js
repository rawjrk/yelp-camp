const catchAsync = require('../utils/catchAsync');
const User = require('../models/users');

module.exports.renderRegisterForm = (req, res) => {
  res.render('users/register');
};

module.exports.registerUser = catchAsync(async (req, res, next) => {
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
});

module.exports.renderLoginForm = (req, res) => {
  const returnTo = req.session.returnTo;
  delete req.session.returnTo;
  res.render('users/login', { returnTo });
};

module.exports.loginSuccessfull = (req, res) => {
  req.flash('success', 'Welcome back!');
  const redirectUrl = req.body._returnTo || '/campgrounds';
  res.redirect(redirectUrl);
};

module.exports.logoutUser = (req, res, next) => {
  req.logout(err => {
    if (err) return next(err);
    req.flash('success', 'Logged you out successfully!');
    res.redirect('/campgrounds');
  });
};
