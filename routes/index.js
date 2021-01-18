//References for this page:
//https://github.com/antoniomdk/seminars_and_talks/blob/1a508e85d2087b4e8efb52cd5d012586779b7898/eslint_best_practices/routes/users.js
//Youtube: "Academind" - https://www.youtube.com/channel/UCSJbGtTlrDami-tDGPUV9-w
//It is importante to mention the order for each router, these routes belongs to  the index
var express = require('express');
var router = express.Router();
var Cart = require('../schemas/cart')

//As it is gonna be necessary to use the product model, the next variable is importing such file
var Product = require('../schemas/product');
//As it is gonna be necessary to use the order model, the next variable is importing such file
var Order = require('../schemas/order');
const app = require('../app');

//By this router it will be possible to get the items and display each one on my home page.
//As we can see, we are defining the structure per raw to show, altogether with the hbs file
router.get('/', function (req, res, next) {
  var successMsg = req.flash('success')[0];
  Product.find(function (err, docs) {
    var productChunks = [];
    var chunkSize = 4;
    for (var i = 0; i < docs.length; i += chunkSize) {
      productChunks.push(docs.slice(i, i + chunkSize));
    }
    res.render('store/index', { title: 'Shopping Cart', products: productChunks, successMsg: successMsg, noMessages: !successMsg });
  });
});

//To confirm that an email has been sent to the user inbox, a "email sent" message will appear to confirm this action
router.get('/user/email_sent', function (req, res, next) {
  res.render('user/email_sent');
});

//By this router, each item will be added by the "id"
//The validation of each adding will be checked in this router and if there is an error,
//an automatic message will be generated
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

//By this router, the total amount of items will decrease by one, not going anywhere but the cart page
router.get('/reduce/:id', function (req, res, next) {
  var productId = req.params.id;
  var cart = new Cart(req.session.cart ? req.session.cart : { items: {} });

  cart.reduceByOne(productId);
  req.session.cart = cart;
  res.redirect('/cart');
});

//By this router, the total amount of items will increase by one, not going anywhere but the cart page
router.get('/increase/:id', function (req, res, next) {
  var productId = req.params.id;
  var cart = new Cart(req.session.cart ? req.session.cart : { items: {} });

  cart.increaseByOne(productId);
  req.session.cart = cart;
  res.redirect('/cart');
});

//By this router, the total amount of items will be deleted, not going anywhere but the cart page
router.get('/remove/:id', function (req, res, next) {
  var productId = req.params.id;
  var cart = new Cart(req.session.cart ? req.session.cart : { items: {} });

  cart.removeItem(productId);
  req.session.cart = cart;
  res.redirect('/cart');
});

//This router will take the user to the cart page, checking the items added at the moment
router.get('/cart', isLoggedIn, function (req, res, next) {
  //This line will check if there is a cart, if there is not cart, the cart page will throw an null list
  if (!req.session.cart) {
    return res.render('store/cart', { products: null });
  }
  //In the other hand, will display some details from the cart
  var cart = new Cart(req.session.cart);
  res.render('store/cart', { products: cart.generateArray(), totalPrice: cart.totalPrice });
});

//This router will bring the customer to the checkout page
router.get('/checkout', isLoggedIn, function (req, res, next) {
  if (!req.session.cart) {
    return res.redirect('/cart');
  }
  var cart = new Cart(req.session.cart);
  res.render('store/checkout', { total: cart.totalPrice });
});

//This router is taking the user to the checkout page and at the same time is loading the order
//into the database
router.post('/checkout', isLoggedIn, function (req, res, next) {
  if (!req.session.cart) {
    return res.redirect('/cart');
  }
  var cart = new Cart(req.session.cart);
  var statusOrder = "ordered";
  var picked = new Date("January 1, 2021 00:00:00");
  var order = new Order({
    user: req.user,
    cart: cart,
    phone: req.body.phone,
    email: req.body.email,
    surname: req.body.surname,
    name: req.body.name,
    time: req.body.time,
    status: statusOrder,
    pickedAt: picked
  });
  //This line will save the order into the database and will confirm the action by displaying a message
  order.save(function (err, result) {
    req.flash('success', 'Successfully bought product!');
    req.session.cart = null;
    res.redirect('/');
  });
});

module.exports = router;

//This function will use passport, and will check if the user has made log in, in this case
//the function is set as logged in, redirecting it to the log in page
function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  req.session.oldUrl = req.url;
  res.redirect('/user/login');
}