//This file will structure the schema for the users collection
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bcrypt = require('bcryptjs');

//To structure the fields, it is necessary to define the data types
var userSchema = new Schema({
    email: { type: String, required: true },
    password: { type: String, required: true }
});

//By the "Bcrypt" module it is possible to hash the password applying the next method
userSchema.methods.encryptPassword = function (password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(5), null);
};

//With this method it is possible to validate if the password match to the hash password
userSchema.methods.validPassword = function (password) {
    return bcrypt.compareSync(password, this.password);
};

module.exports = mongoose.model('User', userSchema);
