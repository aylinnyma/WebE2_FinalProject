const express = require('express');
const router = express.Router();
const profileController = require('../controllers/profileController');
const { isAuthenticated } = require('../middleware/auth');
const upload = require('../config/multer');

router.get('/:username', profileController.getProfile); // public
router.get('/edit/me', isAuthenticated, profileController.getEditProfile); // protected (for logged users)
router.put('/edit/me', isAuthenticated, upload.single('profilePicture'), profileController.updateProfile); // 

module.exports = router;