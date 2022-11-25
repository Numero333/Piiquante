const Sauce = require("../models/Sauce");
const { unlink } = require("fs");

// Function : getOneSauce
exports.getOneSauce = (req, res, next) => {
  /* Using 'findOne' method return 1 element */
  Sauce.findOne({ _id: req.params.id })
    .then((sauce) => {
      res.status(200).json(sauce);
    })
    .catch((error) => {
      res.status(404).json({ error: error });
    });
};

// Function : getAllSauces
exports.getAllSauces = (req, res, next) => {
  /* Using 'find' method return a list of elements */
  Sauce.find()
    .then((sauce) => {
      res.status(200).json(sauce);
    })
    .catch((err) => {
      res.status(400).json(err);
    });
};

// Function : createSauce
exports.createSauce = (req, res, next) => {
  /* Tranform sauce object of the request into exploitable JS */
  const sauceObject = JSON.parse(req.body.sauce);
  /* create new sauce object */
  const sauce = new Sauce({
    /* Spread Syntax iterate over object prop' */
    ...sauceObject,
    /* creating link for the sauce image */
    imageUrl: `${req.protocol}://${req.get("host")}/images/${
      req.file.filename
    }`,
  });
  /* Using 'save' method to save the sauce object in the database */
  sauce
    .save()
    .then(() => {
      res.status(201).json({ message: "Sauce " + req.body.sauce + " ajouté" });
    })
    .catch((err) => {
      res.status(400).json({ error: err });
    });
};

// Function : deleteSauce
exports.deleteSauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id })
    .then((sauce) => {
      /* Get the filename from the image url */
      const filename = sauce.imageUrl.split("/images/")[1];
      /* Verify user have right to delete */
      if (sauce.userId !== req.auth.userId) {
        res.status(403).json({ error: "Access denied !" });
      } else {
        /* Using 'unlink' method from filesystem to delete the file in images folder */
        unlink(`images/${filename}`, () => {
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
    .catch((error) => res.status(401).json({ error }));
};

// Function : modifySauce
exports.modifySauce = (req, res, next) => {
  /* Verify that the request contain a images file */
  const sauceModify = req.file
    ? {
        ...JSON.parse(req.body.sauce),
        imageUrl: `${req.protocol}://${req.get("host")}/images/${
          req.file.filename
        }`,
      }
    : { ...req.body };

  Sauce.findOne({ _id: req.params.id }).then((sauce) => {
    const filename = sauce.imageUrl.split("/images/")[1];
    if (sauce.userId !== req.auth.userId) {
      res.status(403).json({ error: "Access Denied" });
    } else {
      unlink(`images/${filename}`, () => {
        /* Using updateOne to update modified sauce */
        Sauce.updateOne(
          { _id: req.params.id },
          { ...sauceModify, _id: req.params.id }
        )
          .then(() =>
            res.status(201).json({ message: "Sauce updated successfully!" })
          )
          .catch((err) => res.status(400).json({ error: err }));
      });
    }
  });
};

// Function : likeSauce
exports.likeSauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id })
    .then((sauce) => {
      const like = req.body.like;
      const isLiked = sauce.usersLiked.includes(req.body.userId);
      const isDisliked = sauce.usersDisliked.includes(req.body.userId);

      switch (like) {
        case 1:
          Sauce.updateOne(
            { _id: req.params.id },
            {
              /* 'push' to add value to [userLiked] */
              $push: { usersLiked: req.body.userId },
              /* 'inc' to increment likes field */
              $inc: { likes: +1 },
            }
          )
            .then((sauce) =>
              res
                .status(200)
                .json({ message: sauce.name + "Liked ! By" + req.body.userId })
            )
            .catch((error) => res.status(400).json({ error, message: error }));
          break;

        case -1:
          Sauce.updateOne(
            { _id: req.params.id },
            {
              /* 'push' to add value to [userDisliked] */
              $push: { usersDisliked: req.body.userId },
              /* 'inc' to increment dislikes field */
              $inc: { dislikes: +1 },
            }
          )
            .then((sauce) =>
              res
                .status(200)
                .json({
                  message: sauce.name + "Disliked ! By" + req.body.userId,
                })
            )
            .catch((error) => res.status(400).json({ error }));
          break;

        case 0:
          if (isLiked) {
            Sauce.updateOne(
              { _id: req.params.id },
              {
                /* 'pull' to remove value to the [userLiked] array */
                $pull: { usersLiked: req.body.userId },
                /* 'inc' to increment likes field */
                $inc: { likes: -1 },
              }
            )
              .then(() => {
                res.status(200).json({ message: "Like removed !" });
              })
              .catch((error) => res.status(400).json({ error }));
            break;
          }

          if (isDisliked) {
            Sauce.updateOne(
              { _id: req.params.id },
              {
                /* 'pull' to remove value to the [userDisliked] */
                $pull: { usersDisliked: req.body.userId },
                /* 'inc' to increment dislikes field */
                $inc: { dislikes: -1 },
              }
            )
              .then(() => {
                res.status(200).json({ message: "Dislike removed !" });
              })
              .catch((error) => res.status(400).json({ error }));
            break;
          }
      }
    })
    .catch((error) => res.status(400).json({ message: error }));
};
