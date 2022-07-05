const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Review = require('./reviews');

const ImageSchema = new Schema({
  url: String,
  filename: String,
});

ImageSchema.virtual('thumbnail').get(function() {
  return this.url.replace('/upload', '/upload/w_200');
});

const schemaConfig = { toJSON: { virtuals: true } };

const CampgroundSchema = new Schema({
  title: String,
  location: String,
  geometry: {
    type: {
      type: String,
      enum: ['Point'],
      required: true,
    },
    coordinates: {
      type: [Number],
      required: true,
    },
  },
  price: Number,
  description: String,
  images: [ImageSchema],
  author: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
  reviews: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Review',
    },
  ],
}, schemaConfig);

CampgroundSchema.virtual('properties.popUpMarkup').get(function() {
  return `
    <h4 class="mb-0">${ this.title }</h4>  
    <span>${ this.description.substring(0, 80) }...</span>
    <a class="text-right" href="/campgrounds/${ this._id }">Show more</a>
    `;
});

CampgroundSchema.virtual('properties.popUpMarkupNoLink').get(function() {
  return `<h4 class="mb-0">${ this.title }</h4><span class="text-muted">${ this.location }</span>`;
});

CampgroundSchema.post('findOneAndDelete', async campground => {
  if (campground) {
    await Review.deleteMany({ _id: { $in: campground.reviews } });
  }
});

module.exports = mongoose.model('Campground', CampgroundSchema);
