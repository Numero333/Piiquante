const express = require('express');
const router = express.Router();

const sauceController =  require('../controllers/sauce');

const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config');

router.get('/', auth, sauceController.getAllSauces);
router.post('/', auth, multer, sauceController.createSauce);
router.get('/:id', auth, sauceController.getOneSauce);
router.delete('/:id', auth, sauceController.deleteSauce);
router.put('/:id', auth, multer, sauceController.modifySauce);

module.exports = router;