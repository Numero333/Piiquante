const Sauce = require('../models/Sauce');
const fs = require('fs');

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

exports.deleteSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id })
      .then((sauce) => {
        const filename = sauce.imageUrl.split("/images/")[1];
        if (sauce.userId !== req.auth.userId) {
          res.status(403).json({ error: "Authentification error" });
        } else {
        fs.unlink(`images/${filename}`, () => {
          Sauce.deleteOne({ _id: req.params.id })
            .then(() => {
              res.status(200).json({ message: "Supprimé!" + filename });
            })
            .catch((err) => {
              res.status(400).json({ error: err });
            });
        });
      }
      })
      .catch((error) => res.status(500).json({ error }));
  };

  exports.modifySauce = (req, res, next) => {
    const sauceModify = req.file
        ? {
            ...JSON.parse(req.body.sauce),
            imageUrl: `${req.protocol}://${req.get("host")}/images/${
            req.file.filename
            }`,
        }
        : { ...req.body };

  Sauce.findOne({ _id: req.params.id })
    .then((sauce) => {
      const filename = sauce.imageUrl.split("/images/")[1];
      if (sauce.userId !== req.auth.userId) {
        res.status(403).json({ error: "Authentification error" });
      } else {
        fs.unlink(`images/${filename}`, () => {
          Sauce.updateOne(
            { _id: req.params.id },
            { ...sauceModify, _id: req.params.id }
          )
            .then(() =>
              res.status(201).json({ message: "Sauce updated successfully!" })
            )
            .catch((err) => res.status(400).json({error: err}));
        });
      }
    });
};