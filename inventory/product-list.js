//References for this page:
//https://mongoosejs.com/
//"Connect mongodb with node js using mongoose and Create schema || Node js - 11 (Creative Developer)" - https://www.youtube.com/watch?v=6_HI2GxRG6M
//It is important to mention that there were different places where the code was taken, I preferred to did this by watching the video
//If it is necessary to add items to my web application, one option is by this file, another option could be by mongoose or by MongoDB
var Product = require('../schemas/product');
var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/myDB', { useNewUrlParser: true, useUnifiedTopology: true });

var products = [
    new Product({
        imagePath: 'images/SOY.png',
        title: 'SOY',
        description: 'Chunks of protein. None of the meat Meat-free protein just how we like it. Naturally.',
        price: 5
    }),
    new Product({
        imagePath: 'images/MILK.png',
        title: 'MILK',
        description: 'Great frothy alternative to milk produced by cows,made for baristas and those who like to practice their skills at home!',
        price: 2
    }),
    new Product({
        imagePath: 'images/CHEESE.png',
        title: 'CHEESE',
        description: 'These vegan cheese is suitable for vegans and vegetarians. Plus they are low in saturated fat, and low in sugar.',
        price: 5
    }),
    new Product({
        imagePath: 'images/PROTEIN.png',
        title: 'PROTEIN',
        description: 'This supplement is made by vegan nutritionists for vegans. Its 100% natural, a plant based recipe.',
        price: 25
    }),
    new Product({
        imagePath: 'images/TOFU.png',
        title: 'TOFU',
        description: 'Made of condensed soy milk that is pressed into solid white blocks in a process quite similar to cheesemaking.',
        price: 5
    }),
    new Product({
        imagePath: 'images/B12.png',
        title: 'B12',
        description: 'Vegan Vitamin B12 is a must-have supplement for anyone following a vegan or plant-based lifestyle.',
        price: 15
    }),
    new Product({
        imagePath: 'images/DOUGHNUTS.png',
        title: 'DOUGHNUTS',
        description: 'Vegan donuts, including caramel, vegan chocolate and vegan lemon is a perfect option to share anytime and anywhere.',
        price: 20
    }),
    new Product({
        imagePath: 'images/CHOCOLATE.png',
        title: 'CHOCOLATE',
        description: 'For all of you chocolate-loving vegans out there! Vegan chocolate. Chocolate is made from cacao beans.',
        price: 15
    }),
    new Product({
        imagePath: 'images/SPAGHETTI.png',
        title: 'SPAGHETTI',
        description: 'Gluten free, Sugar free, Fat free, Low carbohydrate. Tastes great! Source of fibre and dairy free.',
        price: 6
    }),
    new Product({
        imagePath: 'images/SEITAN.png',
        title: 'SEITAN',
        description: 'A health care product, thanks to its excellent properties can be used to obtain a healthy diet.',
        price: 10
    })
];

//To store all this products, it will be necessary to loop by the next function
var done = 0;
for (var i = 0; i < products.length; i++) {
    products[i].save(function (err, result) {
        done++;
        if (done === products.length) {
            exit();
        }
    });
}

function exit() {
    mongoose.disconnect();
}
