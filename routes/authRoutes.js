const express = require('express'); 
const router = express.Router(); //self-contained router
const authController = require('../controllers/authController');

// register
router.get('/register', authController.getRegister); // show form when user visits page
router.post('/register', authController.postRegister); // process data when user submits form

// login (same as register)
router.get('/login', authController.getLogin);
router.post('/login', authController.postLogin);

// logout
router.get('/logout', authController.logout);

module.exports = router; // export this router for app.js

