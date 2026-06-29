const mongoose = require('mongoose'); // import mongoose
const UserSchema = new mongoose.Schema({ // blueprint to define what a user doc looks like in the database
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true
      },

      email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
      },

      password: {
        // this is hashed
        type: String,
        required: true
      },

      bio: {
        //optional text for user's profile
        type: String,
        default: ''
      },

      profilePicture: {
        type: String,
        default: 'default-avatar.png'
      },

      createdAt: {
        type: Date,
        default: Date.now
      }
});

// compile schema into a user model (mongo creates a collection called users)
module.exports = mongoose.model('User', UserSchema); 

