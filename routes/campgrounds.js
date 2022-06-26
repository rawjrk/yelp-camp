const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const { validateCampground, isLoggedIn, isAuthor } = require('../middleware');

const Campground = require('../models/campground');

router.get('/', catchAsync(async (req, res) => {
  const campgrounds = await Campground.find({});
  res.render('campgrounds/index', { campgrounds });
}));

router.get('/new', isLoggedIn, (req, res) => {
  res.render('campgrounds/new');
});

router.post('/', isLoggedIn, validateCampground,
    catchAsync(async (req, res) => {
      const campground = new Campground(req.body.campground);
      campground.author = req.user._id;
      await campground.save();
      req.flash('success', 'Successfully added a new campground!');
      res.redirect(`/campgrounds/${ campground._id }`);
    }));

router.get('/:id', catchAsync(async (req, res) => {
  const { id } = req.params;
  const campground = await Campground.findById(id)
      .populate('author')
      .populate({
        path: 'reviews',
        populate: { path: 'author' },
      });
  if (!campground) {
    req.flash('error', 'Cannot find that campground!');
    return res.redirect('/campgrounds');
  }
  res.render('campgrounds/show', { campground });
}));

router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(async (req, res) => {
  const { id } = req.params;
  const campground = await Campground.findById(id);
  if (!campground) {
    req.flash('error', 'Cannot find that campground!');
    return res.redirect('/campgrounds');
  }
  res.render('campgrounds/edit', { campground });
}));

router.put('/:id', isLoggedIn, isAuthor, validateCampground,
    catchAsync(async (req, res) => {
      const { id } = req.params;
      const campground = await Campground.findByIdAndUpdate(id,
          { ...req.body.campground });
      await campground.save();
      req.flash('success', 'Successfully updated campground!');
      res.redirect(`/campgrounds/${id}`);
    }));

router.delete('/:id', isLoggedIn, isAuthor, catchAsync(async (req, res) => {
  const { id } = req.params;
  await Campground.findByIdAndDelete(id);
  req.flash('success', 'Successfully deleted campground!');
  res.redirect('/campgrounds');
}));

module.exports = router;
