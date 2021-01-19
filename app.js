var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var expressHbs = require('express-handlebars');
var mongoose =require('mongoose');
var session = require('express-session');
var passport = require('passport');
var flash = require('connect-flash');
var validator = require('express-validator');
var MongoStore = require('connect-mongo')(session);
var nodemailer = require('nodemailer');
var { getMaxListeners } = require('process');
require('dotenv').config();
const uri = process.env.MONGO_URI;

var routes = require('./routes/index');
var userRoutes = require('./routes/user');
var adminRoutes = require('./routes/admin');

var app = express();

//If the database is not created, automatically it will be created

mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });


require('./config/passport');

// Setting the hbs engine
app.engine('.hbs', expressHbs({
  defaultLayout: 'layout', 
  extname: '.hbs'}));
app.set('view engine', '.hbs');

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(validator());
app.use(cookieParser());
//Structuring the session by the JavaScript object, the one that it allows to initialize the session
app.use(session({
  secret: 'mysecret', 
  resave: false, 
  saveUninitialized: false,
  //Indicates to open the connection on mongoose
  store: new MongoStore({ mongooseConnection: mongoose.connection}),
  //Indicates the duration of the session
  cookie: { maxAge:180 * 60 * 1000 }
}));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static(path.join(__dirname, 'public')));

//By this middleware, it will be possible to ejecute a function that interact globally, that
//will interact with the log in task
app.use(function(req, res, next) {
  res.locals.login = req.isAuthenticated();
  res.locals.session = req.session;
  next();
});

app.use('/admin', adminRoutes);
app.use('/user', userRoutes);
app.use('/', routes);

app.get('/send', (req, res) => {
  res.render('contactUs');
});

app.post('/', (req, res) => {
  const output = `
    <p>Customer message</p>
    <h3>Contact Details</h3>
    <ul>  
      <li>Name: ${req.body.fullname}</li>
      <li>Email: ${req.body.email}</li>
      <li>Phone: ${req.body.phone}</li>
    </ul>
    <h3>Message</h3>
    <p>${req.body.message}</p>
  `;

  // create reusable transporter object using the default SMTP transport
  let transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
        port: 465,
        secure: true, // true for 465, false for other ports
        auth: {
            user: process.env.EMAIL, // generated ethereal user

            pass: process.env.PASSWORD  // generated ethereal password
    },
    tls:{
      rejectUnauthorized:false
    }
  });

  // setup email data with unicode symbols
  let mailOptions = {
      from: '"MESSAGES:avocAPP" <no-reply@email.com>', // sender address
      to: 'cjfc12345@gmail.com', // list of receivers
      subject: 'Customer Message', // Subject line
      text: 'Hello world?', // plain text body
      html: output // html body
  };

  // send mail with defined transport object
  transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
          return console.log(error);
      }
      console.log('Message sent: %s', info.messageId);   
      console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));

      res.render('user/email_sent_message', {msg:'Email has been sent'});
  });
  });

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
