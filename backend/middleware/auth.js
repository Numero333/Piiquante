const jwt = require("jsonwebtoken");

// Middleware : Auth
module.exports = (req, res, next) => {
  try {
    /* Get token from the headers request, split it to only keep the token */
    const token = req.headers.authorization.split(" ")[1];
    /* Decode token with 'verify' method (token + passphrase) */
    const decodedToken = jwt.verify(token, "N3FXM_OCDEV_PIIQUANTE");
    /* Get userID from the decoded Token */
    const userId = decodedToken.userId;
    /* Pass auth object to the request to auth navigation */
    req.auth = { userId };
    next();
  } catch (err) {
    res.status(401).json({ err });
  }
};
