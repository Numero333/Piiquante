const express = require("express");
const mongoose = require("mongoose");
const helmet = require("helmet");
const path = require("path");

// Router
const userRoutes = require("./routes/user");
const sauceRoutes = require("./routes/sauce");

// Environment variables
const dotenv = require("dotenv");
dotenv.config();
const username = process.env.USERNAME;
const password = process.env.PASSWORD;

// Starting server
const app = express();

// MongoDB Connexion
mongoose
  .connect(
    `mongodb+srv://${username}:${password}@piiquante-cluster.b0o2sqj.mongodb.net/?retryWrites=true&w=majority`,
    { useNewUrlParser: true, useUnifiedTopology: true }
  )
  .then(() => console.log("Connexion à MongoDB réussie !"))
  .catch((err) => console.log("Connexion à MongoDB échouée ! " + err.message));

// Helmet
app.use(helmet({crossOriginResourcePolicy: false,}));
// Parse request into json
app.use(express.json());

// CORS config
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin",
                "*"
  );
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, OPTIONS"
  );
  next();
});

// Static folder for images
app.use("/images", express.static(path.join(__dirname, "images")));

// Router of user & sauce routes
app.use("/api/auth", userRoutes);
app.use("/api/sauces", sauceRoutes);

module.exports = app;