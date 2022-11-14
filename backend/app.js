// Required Import
const express = require("express");
const mongoose = require("mongoose");

const app = express();

// MongoDB Connexion
mongoose
  .connect(
    `mongodb+srv://${username}:${password}@piiquante-cluster.b0o2sqj.mongodb.net/?retryWrites=true&w=majority`,
    { useNewUrlParser: true, useUnifiedTopology: true }
  )
  .then(() => console.log("Connexion à MongoDB réussie !"))
  .catch(() => console.log("Connexion à MongoDB échouée !"));

 // Parse request into json
app.use(express.json());

app.use((req, res, next) => {

});

module.exports = app;
