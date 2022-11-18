const { Schema, model } = require('mongoose');
const isUnique = require('mongoose-unique-validator');
var ErrorHandler = require('mongoose-errors');

// Using 'Schema' to create a user model
const user = Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }
});

// Catching errors
user.plugin(ErrorHandler);

// Verify mail is unique
user.plugin(isUnique);

module.exports = model('User', user);