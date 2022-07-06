const mongoose = require('mongoose');

const cities = require('./cities');
const { descriptors, places } = require('./seedHelpers');
const Campground = require('../../models/campgrounds');

const mongoUrl = process.env.MONGO_URL || 'mongodb://localhost:27017/yelp-camp';
mongoose.connect(mongoUrl);
// mongoose.connect('mongodb://localhost:27017/yelp-camp');

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
  console.log('Database connected');
});

const sample = array => {
  return array[Math.floor(Math.random() * array.length)];
};

const seedDB = async () => {
  await Campground.deleteMany({});
  for (let i = 0; i < 200; i++) {
    const random1000 = Math.floor(Math.random() * 1000);
    const price = Math.floor(Math.random() * 20) + 10;
    const camp = new Campground({
      author: '62b836dd48c555916faa42a5',
      title: `${sample(descriptors)} ${sample(places)}`,
      location: `${cities[random1000].city}, ${cities[random1000].state}`,
      geometry: {
        type: 'Point',
        coordinates: [
          cities[random1000].longitude,
          cities[random1000].latitude,
        ],
      },
      images: [
        {
          url: 'https://res.cloudinary.com/dxpthu8lk/image/upload/v1656336191/YelpCamp/kaueras6rkazbw5aekxq.jpg',
          filename: 'YelpCamp/kaueras6rkazbw5aekxq',
        },
        {
          url: 'https://res.cloudinary.com/dxpthu8lk/image/upload/v1656336194/YelpCamp/ndrk5zuhyxrubykl5b2w.jpg',
          filename: 'YelpCamp/ndrk5zuhyxrubykl5b2w',
        },
        {
          url: 'https://res.cloudinary.com/dxpthu8lk/image/upload/v1656336192/YelpCamp/mk21arzhf0cffoivnzeo.jpg',
          filename: 'YelpCamp/mk21arzhf0cffoivnzeo',
        },
      ],
      description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolorem expedita, omnis perspiciatis possimus, asperiores voluptas odio fugit velit impedit enim eos quae modi minus a, ab sint. Repudiandae, magni reprehenderit.',
      price: price,
    });
    await camp.save();
  }
};

seedDB().then(() => {
  mongoose.connection.close();
  console.log('Successfully seeded');
});
