'use strict';
var express = require('express');
var router = express.Router();
var passport = require('passport');
var userModel = require('../models/user');
var bcrypt = require('bcryptjs');
/*POST for login*/
//Try to login with passport
router.post('/login', passport.authenticate('local', {
    successRedirect: '/read',
    failureRedirect: '/login',
    failureMessage: 'Invalid Login'
}));
/*POST for register*/
router.post('/register', function (req, res) {
    //Insert user
    bcrypt.hash(req.body.password, 10, function (err, hash) {
        var registerUser = {
            username: req.body.username,
            password: hash
        }
        //Check if user already exists
        userModel.find({ username: registerUser.username }, function (err, user) {
            if (err) console.log(err);
            if (user.length) console.log('Username already exists please login.');
            const newUser = new userModel(registerUser);
            newUser.save(function (err) {
                console.log('Inserting');
                if (err) console.log(err);
                req.login(newUser, function (err) {
                    console.log('Trying to login');
                    if (err) console.log(err);
                    return res.redirect('/');
                });
            });
        });
    })
});
/* GET home page. */
router.get('/', function (req, res) {
    res.render('login', { title: 'Login' });
});
/* GET login page. */
router.get('/login', function (req, res) {
    res.render('login', { title: 'Login' });
});
/* GET Register page. */
router.get('/Register', function (req, res) {
    res.render('Register', { title: 'Register' });
});
/* GET create page. */
router.get('/create', function (req, res) {
    res.render('create', { user: req.user });
});
/* GET read page. */
router.get('/read', function (req, res) {
    res.render('read', { user: req.user });
});
/* GET update page. */
router.get('/update', function (req, res) {
    res.render('update', { user: req.user });
});
/* GET delete page. */
router.get('/delete', function (req, res) {
    res.render('delete', { user: req.user });
});
/*Logout*/
router.get('/logout', function (req, res) {
    req.session.destroy(function (err) {
        res.redirect('/login');
    });
});

module.exports = router;
