//This file will structure the schema for the products collection
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

//To structure the fields, it is necessary to define the data types
var schema = new Schema({
    imagePath: {type: String, required: true},
    title: {type: String, required: true},
    description: {type: String, required: true},
    price: {type: Number, required: true}
});

//At the end, it is gonna be necessary export the model function
module.exports = mongoose.model('Product', schema);