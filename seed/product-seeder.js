var Product = require('../models/product');

var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/shopping');

var products = [
    new Product({
        imagePath: 'https://upload.wikimedia.org/wikipedia/en/5/5e/Gothiccover.png',
        title: 'Gothic Game',
        description: 'Awesome Game',
        price: 15
    }),
    new Product({
        imagePath: 'https://d1r7xvmnymv7kg.cloudfront.net/sites_products/darksouls3/assets/img/DARKSOUL_facebook_mini.jpg',
        title: 'Otro uno',
        description: 'God',
        price: 14
    }),
    new Product({
        imagePath: 'https://upload.wikimedia.org/wikipedia/en/5/51/Minecraft_cover.png',
        title: 'Otro dos',
        description: 'Great',
        price: 13
    }),
    new Product({
        imagePath: 'https://upload.wikimedia.org/wikipedia/en/5/5b/Astroneer_Image1.png',
        title: 'Otro tres',
        description: 'Great',
        price: 12
    }),
    new Product({
        imagePath: 'https://upload.wikimedia.org/wikipedia/commons/8/80/Roblox_Logo_Black.svg',
        title: 'Otro cuatro',
        description: 'Great',
        price: 11
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
