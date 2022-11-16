const Sauce = require('../models/Sauce');

exports.getAllSauces = (req, res, next) => {
    Sauce.find()
      .then((sauce) => {
        res.status(200).json(sauce);
      })
      .catch((err) => {
        res.status(400).json(err);
      });
  };