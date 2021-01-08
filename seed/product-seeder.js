var Product = require('../models/product');

var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/shopping');

var products = [
    new Product({
        imagePath: 'images/SOY.png',
        title: 'SOY',
        description: 'Chunks of protein. None of the meat Meat-free protein just how we like it. Naturally.This product is suitable for Vegetarians and vegans.',
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
        description: 'These vegan cheese is suitable for vegans and vegetarians. Plus they are low in saturated fat, low in sugar and a great source of protein.',
        price: 5
    }),
    new Product({
        imagePath: 'images/PROTEIN.png',
        title: 'PROTEIN',
        description: 'This supplement is made by vegan nutritionists for vegans. Its 100% natural, plant based recipe uses only the finest pure ingredients.',
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
        description: 'For all of you chocolate-loving vegans out there! Vegan chocolate. Chocolate is made from cacao beans, which are grown on cacao trees.',
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
        description: 'A health care product, thanks to its excellent properties can be used to obtain a healthy diet, it can prevent degenerative diseases.',
        price: 10
    })
];


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
