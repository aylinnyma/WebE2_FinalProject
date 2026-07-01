const mongoose = require('mongoose');
const slugify = require('slugify'); //to convert strings into a URL-friendly one

const RecipeSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
      },

      slug: {
        // URL friendly version of title
        type: String,
        unique: true
      },

      description: {
        type: String,
        required: true
      },

      category: {
        type: String,
        required: true,
        enum: ['Breakfast', 'Lunch', 'Dinner', 'Dessert', 'Snack', 'Drink'] //enum because no other options accepted
      },

      tags: {
        type: [String],
        default: []
      },

      image: {
        type: String,
        default: 'default-recipe.png'
      },

      author: {
        type: mongoose.Schema.Types.ObjectId, // reference to User document
        ref: 'User',
        required: true
      },

      likes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      }],

      createdAt: {
        type: Date,
        default: Date.now
      },

      updatedAt: {
        type: Date,
        default: Date.now
      }

});

RecipeSchema.pre('save', function(next) {
    //pre-save hook, runs automatically before any recipe is saves to database
    if (this.isModified('title')) {
      this.slug = slugify(this.title, { lower: true, strict: true });
    }
    /* next(); // tells mongoose to continue saving */
  });

module.exports = mongoose.model('Recipe', RecipeSchema); // compiles schema into a model for mongo to create a collection

