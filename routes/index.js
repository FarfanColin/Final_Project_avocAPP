var express = require('express');
var router = express.Router();
var Cart = require('../models/cart')

var Product = require('../models/product');
var Order = require('../models/order');
const app = require('../app');

/* GET home page. */
router.get('/', function (req, res, next) {
  var successMsg = req.flash('success')[0];
  Product.find(function (err, docs) {
    var productChunks = [];
    var chunkSize = 3;
    for (var i = 0; i < docs.length; i += chunkSize) {
      productChunks.push(docs.slice(i, i + chunkSize));
    }
    res.render('shop/index', { title: 'Shopping Cart', products: productChunks, successMsg: successMsg, noMessages: !successMsg});
  });
});

router.get('/user/email_sent', function(req, res, next) {
  res.render('user/email_sent');
});

router.get('/add-to-cart/:id', function (req, res) {
  var productId = req.params.id;
  var cart = new Cart(req.session.cart ? req.session.cart : { items: {} });

  Product.findById(productId, function (err, product) {
    if (err) {
      return res.redirect('/');
    }
    cart.add(product, product.id);
    req.session.cart = cart;
    console.log(req.session.cart);
    res.redirect('/');
  });
});

router.get('/reduce/:id', function(req, res, next) {
  var productId = req.params.id;
  var cart = new Cart(req.session.cart ? req.session.cart : { items: {} });

  cart.reduceByOne(productId);
  req.session.cart = cart;
  res.redirect('/shopping-cart');
});

router.get('/remove/:id', function(req, res, next) {
  var productId = req.params.id;
  var cart = new Cart(req.session.cart ? req.session.cart : { items: {} });

  cart.removeItem(productId);
  req.session.cart = cart;
  res.redirect('/shopping-cart');
});

router.get('/shopping-cart', function (req, res, next) {
  if (!req.session.cart) {
    return res.render('shop/shopping-cart', { products: null });
  }
  var cart = new Cart(req.session.cart);
  res.render('shop/shopping-cart', { products: cart.generateArray(), totalPrice: cart.totalPrice });
});

router.get('/checkout', isLoggedIn, function (req, res, next) {
  if (!req.session.cart) {
    return res.redirect('/shopping-cart');
  }
  var cart = new Cart(req.session.cart);
  res.render('shop/checkout', { total: cart.totalPrice });
});

router.post('/checkout', isLoggedIn, function (req, res, next) {
  if (!req.session.cart) {
    return res.redirect('/shopping-cart');
  }
  var cart = new Cart(req.session.cart);
  var order = new Order({
    user: req.user,
    cart: cart,
    phone:req.body.phone,
    email: req.body.email,
    surname: req.body.surname,
    name: req.body.name
  });
  order.save(function (err, result) {
    req.flash('success', 'Successfully bought product!');
    req.session.cart = null;
    res.redirect('/');
  });
});

module.exports = router;

function isLoggedIn(req, res, next) {
  if(req.isAuthenticated()) {
      return next();
  }
  req.session.oldUrl = req.url;
  res.redirect('/user/signin');
}
