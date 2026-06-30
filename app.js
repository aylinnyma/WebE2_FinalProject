require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoStore = require('connect-mongo').default;
const passport = require('passport');
const methodOverride = require('method-override');
const path = require('path');

const app = express();

// connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

// passport config 
require('./config/passport')(passport);

// template engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views')); // where to find ejs

// middleware
app.use(express.urlencoded({ extended: true })); // app can read data from HTML forms
app.use(express.json()); // app can read data from json requests
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public'))); // lets public folder be accesed from browser

// session
app.use(session({
  secret: process.env.SESSION_SECRET, //private key
  resave: false, // don't re-save session if nothing changed
  saveUninitialized: false, // no session created for no logged-in users
  store: MongoStore.create({ mongoUrl: process.env.MONGO_URI }) // save sassions to mongodb in case of restart
}));

// passport middleware (required)
app.use(passport.initialize()); 
app.use(passport.session()); // remembers who's logged in accross requests

// global variable so every EJS view knows who's logged in
app.use((req, res, next) => { // this func runs on every request before the route handler
  res.locals.currentUser = req.user || null; // req.user set by passport when smn logs in, with .currentUser every EJS template automatically has access to logged-in user
  next();
});

// routes 
app.get('/', (req, res) => res.render('home')); // first route: home.ejs is found, processed, and an HTML is sent back to browser
app.use('/', require('./routes/authRoutes')); //any route defined here is mounted at /routes/..

const PORT = process.env.PORT || 3000; // start server from PORT from .env, otherwise 3000
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));