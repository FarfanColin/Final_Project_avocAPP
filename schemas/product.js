//References for this page:
//https://mongoosejs.com/
//"Connect mongodb with node js using mongoose and Create schema || Node js - 11 (Creative Developer)" - https://www.youtube.com/watch?v=6_HI2GxRG6M
//It is important to mention that there were different places where the code was taken, I preferred to did this by watching the video
//This file will structure the schema for the products collection
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

//To structure the fields, it is necessary to define the data types
var schema = new Schema({
    imagePath: { type: String, required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true }
});

//At the end, it is gonna be necessary export the model function
module.exports = mongoose.model('Product', schema);