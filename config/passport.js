//Reference for the code:
//http://www.passportjs.org/packages/
//Youtube: "Passport JS User Authentication (Node + Passport + Express + Angular)" - https://www.youtube.com/playlist?list=PLYQSCk-qyTW2ewJ05f_GKHtTIzjynDgjK
//Youtube: "OAuth (Passport.js) Tutorial #15 - Serializing Users" - https://www.youtube.com/watch?v=-PuMp5tQ8Jw
//Youtube: "Register And Login And Authentication Using Node.js With Passport.js (passport-local strategy)" - https://www.youtube.com/watch?v=qUM8zSb9QJw
//It is important to mention that there were different places where the code was taken, I preferred to did this by watching the video
//Within this file it will be possible to validate the data entered by the user on the different inputs
var passport = require('passport');
var User = require('../schemas/user');
var LocalStrategy = require('passport-local').Strategy;
var send = require('./email')();

//This function will ask passsport to store the user into the session
passport.serializeUser(function (user, done) {
    done(null, user.id);
});

//After the user object attaches to the request
passport.deserializeUser(function (id, done) {
    User.findById(id, function (err, user) {
        done(err, user);
    });
});

//This strategy will create a new user by validating the input and checking possible errors
passport.use('local.signup', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
}, function (req, email, password, done) {
    req.checkBody('email', 'Invalid email').notEmpty().isEmail();
    req.checkBody('password', 'Invalid password').notEmpty().isLength({ min: 4 });
    var fname = req.body.fname;
    var sname = req.body.sname;
    var phone = req.body.phone;
    var errors = req.validationErrors();
    if (errors) {
        var messages = [];
        errors.forEach(function (error) {
            messages.push(error.msg);
        });
        return done(null, false, req.flash('error', messages));
    }
    User.findOne({ 'email': email }, function (err, user) {
        if (err) {
            return done(err);
        }
        if (user) {
            return done(null, false, { message: 'Email is already in use.' });
        }
        var newUser = new User();
        newUser.email = email;
        newUser.fname = fname;
        newUser.sname = sname;
        newUser.phone = phone;
        //The next line is using the methods created on the user file, on the model folder
        newUser.password = newUser.encryptPassword(password);

        newUser.save(function (err, result) {

            if (err) {
                return done(err);
            }
            send.sendEmail(email);
            return done(null, newUser);
        });
    });
}));

//The strategy to sign in will be the next one, what this strategy does is to look for the user,
//if the user is not found will throw an error message. If everything goes right, it will return 
//the user
passport.use('local.login', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
}, function (req, email, password, done) {
    req.checkBody('email', 'Invalid email').notEmpty().isEmail();
    req.checkBody('password', 'Invalid password').notEmpty();
    var errors = req.validationErrors();
    if (errors) {
        var messages = [];
        errors.forEach(function (error) {
            messages.push(error.msg);
        });
        return done(null, false, req.flash('error', messages));
    }
    User.findOne({ 'email': email }, function (err, user) {
        if (err) {
            return done(err);
        }
        if (!user) {
            return done(null, false, { message: 'No user found.' });
        }
        if (!user.validPassword(password)) {
            return done(null, false, { message: 'Wrong password.' });
        }
        return done(null, user);
    });
}));