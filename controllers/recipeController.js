// recipe model
const Recipe = require('../models/Recipe');
const Comment = require('../models/Comment');

const STAPLE_OPTIONS = ['Rice', 'Noodle', 'Pasta', 'Bread', 'Potato', 'Quinoa', 'Couscous'];
const MEAL_CATEGORIES = ['Breakfast', 'Lunch', 'Dinner', 'Dessert', 'Snack', 'Drink'];

function escapeRegex(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}


exports.getNewRecipeForm = (req, res) => {
    res.render('recipes/new');
  };

  // create recipe form
exports.createRecipe = async (req, res) => {
  try {
    const { title, description, category, tags, croppedImage } = req.body;
    const tagsArray = tags ? tags.split(',').map(tag => tag.trim()) : [];

    let imageUrl = 'default-recipe.png';

    if (croppedImage && croppedImage.startsWith('data:image')) {
      const cloudinary = require('cloudinary').v2;
      const result = await cloudinary.uploader.upload(croppedImage, {
        folder: 'recipe-blog/recipes'
      });
      imageUrl = result.secure_url;
    } else if (req.file) {
      imageUrl = req.file.path;
    }

    const recipe = new Recipe({
      title,
      description,
      category,
      tags: tagsArray,
      author: req.user._id,
      image: imageUrl
    });

    await recipe.save();
    res.redirect(`/recipes/${recipe.slug}`);
  } catch (err) {
    console.error(err);
    res.render('recipes/new', { error: err.message });
  }
};
   

exports.getAllRecipes = async (req, res) => {
    try {
      const { q, staple, category, tag } = req.query;
      const conditions = [];

      if (q && q.trim()) {
        const regex = new RegExp(escapeRegex(q.trim()), 'i');
        conditions.push({
          $or: [
            { title: regex },
            { description: regex },
            { tags: regex }
          ]
        });
      }

      if (staple && staple.trim()) {
        const stapleRegex = new RegExp(escapeRegex(staple.trim()), 'i');
        conditions.push({
          $or: [
            { title: stapleRegex },
            { description: stapleRegex }
          ]
        });
      }

      if (category && category.trim()) {
        conditions.push({ category: category.trim() });
      }

      if (tag && tag.trim()) {
        conditions.push({
          tags: { $regex: escapeRegex(tag.trim()), $options: 'i' }
        });
      }

      const filter = conditions.length ? { $and: conditions } : {};
      let recipes = await Recipe.find(filter).populate('author').sort({ createdAt: -1 });

      if (staple && staple.trim()) {
        const stapleRegex = new RegExp(escapeRegex(staple.trim()), 'i');
        recipes.sort((a, b) => {
          const aTitleMatch = stapleRegex.test(a.title);
          const bTitleMatch = stapleRegex.test(b.title);
          if (aTitleMatch !== bTitleMatch) return aTitleMatch ? -1 : 1;
          return b.createdAt - a.createdAt;
        });
      }

      const searchQuery = {
        q: q || '',
        staple: staple || '',
        category: category || '',
        tag: tag || ''
      };
      const hasActiveSearch = Object.values(searchQuery).some(value => value.trim());

      res.render('recipes/index', {
        recipes,
        searchQuery,
        hasActiveSearch,
        stapleOptions: STAPLE_OPTIONS,
        mealCategories: MEAL_CATEGORIES
      });
    } catch (err) {
      console.error(err);
      res.redirect('/');
    }
  };

exports.getLikedRecipes = async (req, res) => {
  try {
    const recipes = await Recipe.find({ likes: req.user._id })
      .populate('author')
      .sort({ createdAt: -1 });

    res.render('recipes/liked', { recipes });
  } catch (err) {
    console.error(err);
    res.redirect('/recipes');
  }
};

exports.getRecipeBySlug = async (req, res) => {
    try {
        // req.params.slug comes from URL itself, if no matched recipes, render a 404
      const recipe = await Recipe.findOne({ slug: req.params.slug }).populate('author');
      if (!recipe) {
        return res.status(404).render('404');
      }

      const comments = await Comment.find({ recipe: recipe._id })
      .populate('author')
      .sort({ createdAt: -1 });

      const ratedComments = comments.filter(comment => comment.rating);
      const averageRating = ratedComments.length
        ? (ratedComments.reduce((sum, comment) => sum + comment.rating, 0) / ratedComments.length)
        : null;

      res.render('recipes/show', {
        recipe,
        comments,
        averageRating,
        reviewCount: ratedComments.length
      });
    } catch (err) {
      console.error(err);
      res.redirect('/recipes');
    }
  };

exports.getEditRecipeForm = async (req, res) => {
    try {
      const recipe = await Recipe.findOne({ slug: req.params.slug });
      if (!recipe) return res.status(404).render('404');
        
      // authorship check
      if (recipe.author.toString() !== req.user._id.toString()) {
        return res.redirect('/recipes');
      }
  
      res.render('recipes/edit', { recipe });
    } catch (err) {
      console.error(err);
      res.redirect('/recipes');
    }
  };

  // ownership check
  exports.updateRecipe = async (req, res) => {
    try {
      const recipe = await Recipe.findOne({ slug: req.params.slug });
      if (!recipe) return res.status(404).render('404');
  
      if (recipe.author.toString() !== req.user._id.toString()) {
        return res.redirect('/recipes');
      }
  
      const { title, description, category, tags } = req.body;
      const tagsArray = tags ? tags.split(',').map(tag => tag.trim()) : [];
  
      recipe.title = title;
      recipe.description = description;
      recipe.category = category;
      recipe.tags = tagsArray;
      recipe.updatedAt = Date.now(); // update, not create
  
      if (req.body.croppedImage && req.body.croppedImage.startsWith('data:image')) {
        const cloudinary = require('cloudinary').v2;
        const result = await cloudinary.uploader.upload(req.body.croppedImage, {
          folder: 'recipe-blog/recipes'
        });
        recipe.image = result.secure_url;
      } else if (req.file) {
        recipe.image = req.file.path;
      }
  
      await recipe.save();
      res.redirect(`/recipes/${recipe.slug}`);
    } catch (err) {
      console.error(err);
      res.redirect('/recipes');
    }
  };

  // ownsership, then delete permanently from database
  exports.deleteRecipe = async (req, res) => {
    try {
      const recipe = await Recipe.findOne({ slug: req.params.slug });
      if (!recipe) return res.status(404).render('404');
  
      if (recipe.author.toString() !== req.user._id.toString()) {
        return res.redirect('/recipes');
      }
  
      await Recipe.deleteOne({ _id: recipe._id });
      res.redirect('/recipes');
    } catch (err) {
      console.error(err);
      res.render('recipes/new', { error: err.message });
    }
/*     } catch (err) {
      console.error(err);
      res.redirect('/recipes');
    } */
  };