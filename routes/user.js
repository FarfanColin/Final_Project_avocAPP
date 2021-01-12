//It is importante to mention the order for each router, these routes belongs to the user
var express = require('express');
var router = express.Router();
var csrf = require('csurf');
var passport = require('passport');

var Order = require('../schemas/order');
var Cart = require('../schemas/cart');

var csrfProtection = csrf();
router.use(csrfProtection);

//This router will allow the admin to check the status of each order made
router.get('/orders', isLoggedIn, function (req, res, next) {
  Order.find({order: req.order}, function(err, orders) {
    if(err) {
      return res.write('Error');
    }
    var cart;
    orders.forEach(function(order) {
      cart = new Cart(order.cart);
      order.items = cart.generateArray();
    });
    res.render('admin/orders', {orders:orders });
  });
});

//Besides of bringing the profile page, this router is displaying the orders made by the user
//in certain moment by the "Orders.find" altogether with the cart variable, same action that 
//will work on mongoose by "db.orders.find().pretty()"
router.get('/profile', isLoggedIn, function (req, res, next) {
  Order.find({user: req.user}, function(err, orders) {
    if(err) {
      return res.write('Error');
    }
    var cart;
    orders.forEach(function(order) {
      cart = new Cart(order.cart);
      order.items = cart.generateArray();
    });
    res.render('user/profile', {orders:orders });
  });
});

//This is a simple router that take the use to know more about the shop on the "About Us" page
router.get('/aboutUs', function(req, res, next) {
  res.render('user/aboutUs');
});

//This router will head the user to the "Contact Us" page where is gonna be possible ask for information to the admin
router.get('/contactUs', isLoggedIn, function(req, res, next) {
  res.render('user/contactUs');
});

//To confirm that an email has been sent to the user inbox, a "email sent" message will appear to confirm this action
router.get('/email_sent', function(req, res, next) {
  res.render('user/email_sent');
});

//At the moment that the user desire to leave the session, the "Log out" task will head to the home page
router.get('/logout', function (req, res, next) {
  req.logout();
  res.redirect('/');
});

//This router support the rest of the pages to link them to the home page
router.use('/', notLoggedIn, function(req, res, next) {
  next();
});

//This router will take the user to the signup page, at the same time it is gonna be
//necessary to bring up the csrf package by the csrf token that will protect my session.
//At the same time if any error occur, it will be managed by "Flash" that is gonna throw
//an error message.
router.get('/signup', function (req, res, next) {
  var messages = req.flash('error');
  res.render('user/signup', {csrfToken: req.csrfToken(), messages: messages, hasErrors: messages.length > 0});
});

//By this router it is possible to use the strategy applied on the passport file
router.post('/signup', passport.authenticate('local.signup', {
  successRedirect: '/user/email_sent',
  failureRedirect: '/user/signup',
  failureFlash: true
}));

//Basucally this function it is gonna react as the sign up router, that is gonna use a csrg token to 
//protect the session, and the flash errors working as the sign up ones does
router.get('/login', function (req, res, next) {
  var messages = req.flash('error');
  res.render('user/login', { csrfToken: req.csrfToken(), messages: messages, hasErrors: messages.length > 0 });
});

//This router will use the strategy applied on the passport file, plus 
router.post('/login', passport.authenticate('local.login', {
  failureRedirect: '/user/login',
  failureFlash: true
}), function (req, res, next) {
  if (req.session.oldUrl) {
    var oldUrl = req.session.oldUrl;
    req.session.oldUrl = null;
    res.redirect(oldUrl);
  } else {
    res.redirect('/user/profile');
  }
});

module.exports = router;

//This function will use passport, and will check if the user has made log in, in this case
//the function is set as logged in, redirecting it to the log in page
function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  } 
  res.redirect('/user/login');
}

//This function will work similar to the above one, in this case the function is set as logged out in
//redirecting it to the home page
function notLoggedIn(req, res, next) {
  if (!req.isAuthenticated()) {
    return next();
  }
  res.redirect('/');
}