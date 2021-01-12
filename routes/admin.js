var express = require('express');
var router = express.Router();
var csrf = require('csurf');
var passport = require('passport');

var Order = require('../schemas/order');
var Cart = require('../schemas/cart');

var csrfProtection = csrf();
router.use(csrfProtection);

router.get('/orders', isLoggedIn, function (req, res, next) {
  Order.find({ order: req.order }, function (err, orders) {
    if (err) {
      return res.write('Error');
    }
    var cart;
    orders.forEach(function (order) {
      cart = new Cart(order.cart);
      order.items = cart.generateArray();
    });
    res.render('admin/orders', { orders: orders });
  });
});

router.use('/', notLoggedIn, function (req, res, next) {
  next();
});

module.exports = router;

//This function will use passport, and will check if the user has made log in, in this case
//the function is set as logged in, redirecting it to the log in page
function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/');
}

//This function will work similar to the above one, in this case the function is set as logged out in
//redirecting it to the home page
function notLoggedIn(req, res, next) {
  if (!req.isAuthenticated()) {
    return next();
  }
  res.redirect('/');
}