if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const engine = require('ejs-mate');
const methodOverride = require('method-override');
const session = require('express-session');
const flash = require('connect-flash');
const ExpressError = require('./utils/ExpressError');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const mongoSanitize = require('express-mongo-sanitize');
const helmet = require('helmet');

const User = require('./models/users');
const userRoutes = require('./routes/users');
const campgroundRoutes = require('./routes/campgrounds');
const reviewRoutes = require('./routes/reviews');

const MongoStore = require('connect-mongo');

// const mongoUrl = process.env.MONGO_URL || 'mongodb://localhost:27017/yelp-camp';
const mongoUrl = 'mongodb://localhost:27017/yelp-camp';
mongoose.connect(mongoUrl);

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
  console.log('Database connected');
});

const app = express();

app.engine('ejs', engine);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(mongoSanitize());

const store = MongoStore.create({
  mongoUrl,
  touchAfter: 24 * 3600,
});

store.on('error', function(err) {
  console.log('Session Store Error', err);
});

const secret = process.env.SECRET || 'fsafhaha';

const sessionConfig = {
  store,
  name: 'session',
  secret,
  resave: false,
  saveUninitialized: true,
  cookie: {
    httpOnly: true,
    // secure: true,
    expires: Date.now() + 7 * 24 * 3600 * 1000,
    maxAge: 7 * 24 * 3600 * 1000,
  },
};
app.use(session(sessionConfig));
app.use(flash());

app.use(helmet());

const scriptSrcUrls = [
  'https://stackpath.bootstrapcdn.com/',
  'https://api.tiles.mapbox.com/',
  'https://api.mapbox.com/',
  'https://kit.fontawesome.com/',
  'https://cdnjs.cloudflare.com/',
  'https://cdn.jsdelivr.net',
];
const styleSrcUrls = [
  'https://cdn.jsdelivr.net',
  'https://kit-free.fontawesome.com/',
  'https://stackpath.bootstrapcdn.com/',
  'https://api.mapbox.com/',
  'https://api.tiles.mapbox.com/',
  'https://fonts.googleapis.com/',
  'https://use.fontawesome.com/',
];
const connectSrcUrls = [
  'https://api.mapbox.com/',
  'https://a.tiles.mapbox.com/',
  'https://b.tiles.mapbox.com/',
  'https://events.mapbox.com/',
];
const fontSrcUrls = [];
app.use(
    helmet.contentSecurityPolicy({
      directives: {
        defaultSrc: [],
        connectSrc: [`'self'`, ...connectSrcUrls],
        scriptSrc: [`'unsafe-inline'`, `'self'`, ...scriptSrcUrls],
        styleSrc: [`'self'`, `'unsafe-inline'`, ...styleSrcUrls],
        workerSrc: [`'self'`, 'blob:'],
        objectSrc: [],
        imgSrc: [
          `'self'`,
          'blob:',
          'data:',
          'https://res.cloudinary.com/dxpthu8lk/',
          'https://images.unsplash.com/',
        ],
        fontSrc: [`'self'`, ...fontSrcUrls],
      },
    }),
);

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
  res.locals.success = req.flash('success');
  res.locals.error = req.flash('error');
  res.locals.currentUser = req.user;
  res.locals.isIndexPage = req.path === '/campgrounds';
  res.locals.isFormRenderPage = req.path.includes('/edit') ||
      ['/login', '/register', '/campgrounds/new'].includes(req.path);
  res.locals.isShowPage = !(res.locals.isIndexPage || res.locals.isFormRenderPage);
  res.locals.currentPath = req.path;
  next();
});

app.use('/', userRoutes);
app.use('/campgrounds', campgroundRoutes);
app.use('/campgrounds/:id/reviews', reviewRoutes);

app.get('/', (req, res) => {
  res.render('home');
});

app.all('*', (req, res, next) => {
  throw new ExpressError('Page Not Found', 404);
});

app.use((err, req, res, next) => {
  const { statusCode = 500 } = err;
  if (!err.message) err.message = 'Something Went Wrong';
  res.status(statusCode).render('error', { err });
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Serving on port ${port}`);
});
