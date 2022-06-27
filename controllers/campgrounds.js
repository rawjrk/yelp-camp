const catchAsync = require('../utils/catchAsync');
const { cloudinary } = require('../cloudinary');
const Campground = require('../models/campground');

module.exports.index = catchAsync(async (req, res) => {
  const campgrounds = await Campground.find({});
  res.render('campgrounds/index', { campgrounds });
});

module.exports.renderNewForm = (req, res) => {
  res.render('campgrounds/new');
};

module.exports.createCampground = catchAsync(async (req, res) => {
  const campground = new Campground(req.body.campground);
  campground.author = req.user._id;
  campground.images = req.files.map(
      f => ({ url: f.path, filename: f.filename }));
  await campground.save();
  console.log(campground);
  req.flash('success', 'Successfully added a new campground!');
  res.redirect(`/campgrounds/${ campground._id }`);
});

module.exports.showCampground = catchAsync(async (req, res) => {
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
});

module.exports.renderEditForm = catchAsync(async (req, res) => {
  const { id } = req.params;
  const campground = await Campground.findById(id);
  if (!campground) {
    req.flash('error', 'Cannot find that campground!');
    return res.redirect('/campgrounds');
  }
  res.render('campgrounds/edit', { campground });
});

module.exports.updateCampground = catchAsync(async (req, res) => {
  const { id } = req.params;
  const campground = await Campground.findByIdAndUpdate(id,
      { ...req.body.campground });
  const newImages = req.files.map(f => ({ url: f.path, filename: f.filename }));
  campground.images.push(...newImages);
  await campground.save();
  if (req.body.deleteImages) {
    for (const filename of req.body.deleteImages) {
      await cloudinary.uploader.destroy(filename);
    }
    await campground.updateOne({ $pull: { images: {
      filename: { $in: req.body.deleteImages },
    } } });
  }
  req.flash('success', 'Successfully updated campground!');
  res.redirect(`/campgrounds/${id}`);
});

module.exports.deleteCampground = catchAsync(async (req, res) => {
  const { id } = req.params;
  await Campground.findByIdAndDelete(id);
  req.flash('success', 'Successfully deleted campground!');
  res.redirect('/campgrounds');
});
