// Required Import
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

var passwordValidator = require("password-validator");

// Config for password validation
var checkPassword = new passwordValidator();

checkPassword
  .is()
    .min(8)
    .max(128)
  .has()
    .uppercase()
    .symbols()
    .not().spaces()

// Import User Model
const User = require("../models/user");

// Function : signup
exports.signup = (req, res, next) => {
  if(!checkPassword.validate(req.body.password)) {
    return res.status(403).json({ error });
  }
  /* Using 'bcrypt' to encrypt (10 times) password */
  bcrypt
    .hash(req.body.password, 10)
    /* Create a new user taking mail from request + encrypted password */
    .then((hash) => {
      const user = new User({
        email: req.body.email,
        password: hash,
      });
      /* Saving new user to the database */
      user.save()
        .then(() => res.status(201).json({ message: "New user !" }))
        .catch((error) => res.status(400).json({ error }));
    })
    .catch((error) => res.status(401).json({ error }));
};

// Function : login
exports.login = (req, res, next) => {
  /* Using express method 'findOne' to verify user
     is existing in the database */
  User.findOne({ email: req.body.email })
    .then((user) => {
      if (!user) {
        return res.status(401).json({
          message: "Invalid : Username/password",
        });
      }
      /* Using bcrypt method 'compare' to compare password
         from the client request to the database */
      bcrypt
        .compare(req.body.password, user.password)
        .then((valid) => {
          if (!valid) {
            return res.status(401).json({
              message: "Invalid : Username/password",
            });
          }
          res.status(200).json({
            userId: user._id,
            /* Using 'jsonwebtoken' to attribute a Token valid for 24h */
            token: jwt.sign({ userId: user._id }, "N3FXM_OCDEV_PIIQUANTE", {
              expiresIn: "24h",
            }),
          });
        })
        .catch((err) => res.status(401).json({ err }));
    })
    .catch((err) => res.status(401).json({ err }));
};
