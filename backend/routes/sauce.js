const express = require('express');
const router = express.Router();

const sauceController =  require('../controllers/sauce');

// Calling 'auth' middleware to authenticate all routes
const auth = require('../middleware/auth');

// Calling 'multer' middleware for image files management
const multer = require('../middleware/multer-config');

// All sauce routes
router.get('/', auth, sauceController.getAllSauces);
router.post('/', auth, multer, sauceController.createSauce);
router.get('/:id', auth, sauceController.getOneSauce);
router.delete('/:id', auth, sauceController.deleteSauce);
router.put('/:id', auth, multer, sauceController.modifySauce);
router.post('/:id/like', auth, sauceController.likeSauce);

module.exports = router;