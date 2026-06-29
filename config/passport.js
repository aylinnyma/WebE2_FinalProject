const LocalStrategy = require('passport-local').Strategy; // username/password login
const bcrypt = require('bcryptjs'); // compares password the user types with the hashed-one stored in the db
const User = require('../models/User'); // user model looks up user in db

module.exports = function(passport) {
    passport.use(new LocalStrategy( //define how passport checks credential (strategy)
      { usernameField: 'email' }, // passport looks for username, but we log in with email
      async (email, password, done) => { //passport calls func with what user typed
        try {
            // look up user in db by email
            const user = await User.findOne({ email });
            if (!user) {
              return done(null, false, { message: 'No account found with that email' });
            }

            const isMatch = await bcrypt.compare(password, user.password); // bycript.compare checks passwords match
            if (!isMatch) {
              return done(null, false, { message: 'Incorrect password' });
            }

            // if everything passed, this tells passport user is authenticated and grants data
            return done(null, user);
      } catch (err) {
        // for any database errors
        return done(err);
      }
    }
  ));

  passport.serializeUser((user, done) => {
    // for after login, serializeUser stores ID
    done(null, user.id);
  });

  passport.deserializeUser(async (id, done) => {
    // for subsequent requests, passport takes ID from session and fetches the full user from db (this is what populates req.user on app.js)
    try {
      const user = await User.findById(id);
      done(null, user);
    } catch (err) {
      done(err);
    }
  });
};