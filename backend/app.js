const express = require("express");

const app = express();

app.use(express.json());

app.use((req, res, next) => {

});

module.exports = app;
