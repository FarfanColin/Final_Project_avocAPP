//References for this page:
//https://mongoosejs.com/
//"Connect mongodb with node js using mongoose and Create schema || Node js - 11 (Creative Developer)" - https://www.youtube.com/watch?v=6_HI2GxRG6M
//It is important to mention that there were different places where the code was taken, I preferred to did this by watching the video
//The schema for the orders will be define on this page
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var schema = new Schema({
    //As we can see the type of user is "Types.ObjectId", this is taken from the user.js file in the model folder
    user: { type: Schema.Types.ObjectId, ref: 'User' },
    cart: { type: Object, required: true },
    phone: { type: String, required: true },
    email: { type: String, required: true },
    fullname: { type: String, required: true },
    time: { type: Date, required: true },
    //The next lines will help the admin to manage the orders picked by mongoose or MongoDB Compass
    status: { type: String, required: false },
    pickedAt: { type: Date, required: false }
});

module.exports = mongoose.model('Order', schema);