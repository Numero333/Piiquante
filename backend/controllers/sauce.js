const Sauce = require('../models/Sauce');

exports.getOneSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id })
      .then((sauce) => {
        res.status(200).json(sauce);
      })
      .catch((error) => {
        res.status(404).json({ error: error });
      });
  };

exports.getAllSauces = (req, res, next) => {
    Sauce.find()
      .then((sauce) => {
        res.status(200).json(sauce);
      })
      .catch((err) => {
        res.status(400).json(err);
      });
  };

exports.createSauce = (req, res, next) => {
  const sauceObject = JSON.parse(req.body.sauce);
  const sauce = new Sauce({
    ...sauceObject,
    imageUrl: `${req.protocol}://${req.get("host")}/images/${
      req.file.filename
    }`,
  });
  sauce.save()
    .then(() => {
      res.status(201).json({ message: "Sauce " + req.body.sauce + " ajouté" });
    })
    .catch((err) => {
      res.status(400).json({ error: err });
    });
};