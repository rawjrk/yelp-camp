const mongoose = require('mongoose');

const cities = require('./cities');
const { descriptors, places } = require('./seedHelpers');
const Campground = require('../models/campground')

mongoose.connect('mongodb://localhost:27017/yelp-camp');

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
  console.log("Database connected");
});

const sample = (array) => {
  return array[Math.floor(Math.random() * array.length)];
}

const seedDB = async () => {
  await Campground.deleteMany({});
  for (let i = 0; i < 50; i++) {
    const random1000 = Math.floor(Math.random() * 1000);
    const price = Math.floor(Math.random() * 20) + 10;
    const camp = new Campground({
      title: `${sample(descriptors)} ${sample(places)}`,
      location: `${cities[random1000].city}, ${cities[random1000].state}`,
      image: 'http://source.unsplash.com/collection/484351',
      description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolorem expedita, omnis perspiciatis possimus, asperiores voluptas odio fugit velit impedit enim eos quae modi minus a, ab sint. Repudiandae, magni reprehenderit.',
      price: price
    });
    await camp.save();
  }
}

seedDB().then(() => {
  mongoose.connection.close();
  console.log("Successfully seeded");
});