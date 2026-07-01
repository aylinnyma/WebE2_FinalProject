const User = require('../models/User'); // profile data
const Recipe = require('../models/Recipe'); // recipes created by user
const upload = require('../config/multer');

exports.getProfile = async (req, res) => {
    try {
        // find user by username from URL
      const user = await User.findOne({ username: req.params.username });
      if (!user) return res.status(404).render('404');
      // find recipes where author matches user's ID
      const recipes = await Recipe.find({ author: user._id }).sort({ createdAt: -1 });
      // pass both to profileUser
      res.render('profile/show', { profileUser: user, recipes });
    } catch (err) {
      console.error(err);
      res.redirect('/');
    }
  };

 // show edit profile form 
exports.getEditProfile = async (req, res) => {
    try {
        // find user by (logged in) user id 
      const user = await User.findById(req.user._id);
      res.render('profile/edit', { profileUser: user });
    } catch (err) {
      console.error(err);
      res.redirect('/');
    }
  };

  // lets users update bio and profile picture, searching by ID
exports.updateProfile = async (req, res) => {
    try {
      const { bio } = req.body;
  
      const updateData = { bio };
        
      // only upload if new one was uploaded
      if (req.file) {
        updateData.profilePicture = req.file.filename;
      }
  
      await User.findByIdAndUpdate(req.user._id, updateData);
      res.redirect(`/profile/${req.user.username}`);
    } catch (err) {
      console.error(err);
      res.redirect('/profile/edit');
    }
  };