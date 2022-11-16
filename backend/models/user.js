const mongoose = require('mongoose');
const isUniqueMail = require('mongoose-unique-validator');
var ErrorHandler = require('mongoose-errors');

const user = mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }
});
user.plugin(ErrorHandler);
user.plugin(isUniqueMail);

module.exports = mongoose.model('User', user);