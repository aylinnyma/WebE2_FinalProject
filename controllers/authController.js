const User = require('../models/User'); // to create and find users
const bcrypt = require('bcryptjs'); // hashses passwords
const passport = require('passport'); // handles login

exports.getRegister = (req, res) => {
    // handles GET request to /register (renders reg form)
    res.render('auth/register');
  };

exports.postRegister = async (req, res) => {
    // handles submission (POST)
    const { username, email, password, password2 } = req.body;

    try {
        // validation, if passwords don't match, re-render form with error message & keep username/email fields
        if (password !== password2) {
          return res.render('auth/register', { error: 'Passwords do not match', username, email });
        }
        const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) { // check if email or username is already registered
      return res.render('auth/register', { error: 'Email or username already in use', username, email });
    }
    const salt = await bcrypt.genSalt(10); // generate random string (hash uniqueness), where 10 is cost factor, to make algorithm slow and resist brute force attacks
    const hashedPassword = await bcrypt.hash(password, salt); // combines password and salt, this is what gets actually stored

    const user = await User.create({
        // creates new user doc in mongodb with hashed password
        username,
        email,
        password: hashedPassword
      });
    
      req.login(user, (err) => {
        // provided by password, logs user in immediately after registration & redirects to /recipes
        if (err) return next(err);
        res.redirect('/recipes');
      });

    } catch (err) {
      console.error(err);
      res.render('auth/register', { error: 'Something went wrong, please try again' });
    }
  };

  exports.getLogin = (req, res) => {
    // render login form on a GET request to /login
    res.render('auth/login');
  };

  exports.postLogin = (req, res, next) => {
    // passports middleware handles actual login with configured local strategy
    passport.authenticate('local', {
      successRedirect: '/recipes',
      failureRedirect: '/login',
      failureFlash: false
    })(req, res, next);
  };

  exports.logout = (req, res, next) => {
    // clears session and logs user out
    req.logout((err) => {
      if (err) return next(err);
      res.redirect('/login');
    });
  };