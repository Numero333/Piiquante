const multer = require("multer");

// Define the type of file accepted
const MIME_TYPES = {
  "image/jpg": "jpg",
  "image/jpeg": "jpg",
  "image/png": "png",
};

// Define where the file is stored and named
const storage = multer.diskStorage({
  /* Specify folder destination */
  destination: (req, file, callback) => {
    callback(null, "images");
  },

  /* Specify filename */
  filename: (req, file, callback) => {
    /* Get the name without whitespace prevent error */
    const name = file.originalname.split(" ").join("_");
    const extension = MIME_TYPES[file.mimetype];

    /* Create a name with original name + timestamp + extension */
    callback(null, name + Date.now() + "." + extension);
  },
});

// Using 'multer' methode, passing storage object, using 'Single' method to specify a unique file
module.exports = multer({ storage: storage }).single("image");
