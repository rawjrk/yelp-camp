const mongoose = require('mongoose');
const Campground = require('../models/campgrounds');
const campsites = require('./campsites.json');

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

const mongoUrl = process.env.MONGO_URL || 'mongodb://localhost:27017/yelp-camp';
mongoose.connect(mongoUrl);

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
  console.log('Database connected');
});

const seedDB = async () => {
  await Campground.deleteMany({});
  for (const campsite of campsites) {
    const campground = new Campground({
      title: campsite.site_name || '(unavailabe)',
      location: `${campsite.town}, ${campsite.country}`,
      geometry: {
        type: 'Point',
        coordinates: [
          campsite.longitude,
          campsite.latitude,
        ],
      },
      price: parseFloat(campsite.cost.replace('€', '')),
      description: campsite.comments.replace('\v', ''),
      images: [
        {
          url: 'https://res.cloudinary.com/dxpthu8lk/image/upload/v1656336194/YelpCamp/ndrk5zuhyxrubykl5b2w.jpg',
          filename: 'YelpCamp/ndrk5zuhyxrubykl5b2w',
        },
        {
          url: 'https://res.cloudinary.com/dxpthu8lk/image/upload/v1656336191/YelpCamp/kaueras6rkazbw5aekxq.jpg',
          filename: 'YelpCamp/kaueras6rkazbw5aekxq',
        },
      ],
      author: '62c572f1848c8459caebafac',
    });
    await campground.save();
  }
};

seedDB().then(() => {
  db.close();
  console.log('Seeded successfully');
});
