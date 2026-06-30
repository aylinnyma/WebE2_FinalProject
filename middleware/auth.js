exports.isAuthenticated = (req, res, next) => { //method for passport to add to every req, to verify user is logged in
    if (req.isAuthenticated()) {
      return next();
    }
    res.redirect('/login');
  };