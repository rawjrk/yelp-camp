const catchAsync = require('../utils/catchAsync');
const Campground = require('../models/campgrounds');
const { cloudinary } = require('../cloudinary');
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapboxToken = process.env.MAPBOX_TOKEN;
const geocoder = mbxGeocoding({ accessToken: mapboxToken });


module.exports.index = catchAsync(async (req, res) => {
  const campgrounds = await Campground.find({});
  res.render('campgrounds/index', { campgrounds });
});

module.exports.renderNewForm = (req, res) => {
  res.render('campgrounds/new');
};

module.exports.createCampground = catchAsync(async (req, res) => {
  const geoData = await geocoder.forwardGeocode({
    query: req.body.campground.location,
    limit: 1,
  }).send();
  const campground = new Campground(req.body.campground);
  campground.geometry = geoData.body.features[0].geometry;
  campground.images = req.files.map(
      f => ({ url: f.path, filename: f.filename }));
  campground.author = req.user._id;
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
