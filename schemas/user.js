//References for this page:
//https://mongoosejs.com/
//"Connect mongodb with node js using mongoose and Create schema || Node js - 11 (Creative Developer)" - https://www.youtube.com/watch?v=6_HI2GxRG6M
//It is important to mention that there were different places where the code was taken, I preferred to did this by watching the video
//This file will structure the schema for the users collection
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bcrypt = require('bcryptjs');

//To structure the fields, it is necessary to define the data types
var userSchema = new Schema({
    email: { type: String, required: true },
    password: { type: String, required: true },
    fname: { type: String, required: true },
    sname: { type: String, required: true },
    phone: { type: String, required: true }
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
