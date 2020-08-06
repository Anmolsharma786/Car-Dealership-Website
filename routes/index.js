'use strict';
var express = require('express');
var router = express.Router();
var passport = require('passport');
var userModel = require('../models/user');
var articlesModel = require('../models/CarInfo');
var bcrypt = require('bcryptjs');
var formidable = require('formidable');
var fs = require('fs');
var path = require('path');
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
/*upload the advertisment*/
router.post('/create', function (req, res) {
    var form = new formidable.IncomingForm();
    //Specify our image file directory
    form.uploadDir = path.join(__dirname, '../public/images');
    form.parse(req, function (err, fields, files) {
        console.log('Parsed form.');
        //Update filename
        files.image.name = fields.name + '.' + files.image.name.split('.')[1];
        //Create a new article using the Articles Model Schema
        const article = new articlesModel({ name: fields.name, make: fields.make, image: files.image.name, year: fields.year, price: fields.price, description: fields.description, contact: fields.contact });
        //Insert article into DB
        article.save(function (err) {
            console.log(err);
        });
        //Upload file on our server
        fs.rename(files.image.path, path.join(form.uploadDir, files.image.name), function (err) {
            if (err) console.log(err);
        });
        console.log('Received upload');
    });
    form.on('error', function (err) {
        console.log(err);
    });
    form.on('end', function (err, fields, files) {
        console.log('File successfuly uploaded');
        //res.end('File successfuly uploaded');
    });


    res.redirect('/read');
});
/* GET read page. */
router.get('/read', function (req, res) {
    try {
        //Retrieve all articles if there is any 
        articlesModel.find({}, function (err, foundArticles) {
            console.log(err);
            console.log(foundArticles);
            //Pass found articles from server to pug file
            res.render('read', { user: req.user, articles: foundArticles });
        });
    } catch (err) {
        console.log(err);
        res.render('login', { title: 'Login' });
    }
});
/*updating the ad*/
router.get('/update/:id', function (req, res) {
    articlesModel.findById(req.params.id, function (err, foundArticle) {
        if (err) console.log(err);
        //Render update page with specific article
        res.render('update', { user: req.user, article: foundArticle })
    })
});
/* GET update page. */
router.post('/update', function (req, res) {
    console.log(req.body);
    articlesModel.findByIdAndUpdate(req.body.id, { name: req.body.name, make: req.body.make, image: req.body.image, year: req.body.year, price: req.body.price, description: req.body.description, contact: req.body.contact}, function (err, model) {
        console.log(err);
    });
    res.redirect('/read');
});
/* GET delete page. */
router.post('/delete/:id', function (req, res) {
    //Find and delete article
    articlesModel.findByIdAndDelete(req.params.id, function (err, model) {
        
        res.send({ "success": "Article Successfully Deleted!" })
        /*res.redirect('/read');*/
    });
});
/*Logout*/
router.get('/logout', function (req, res) {
    req.session.destroy(function (err) {
        res.redirect('/login');
    });
});

/*Get for search page*/
router.get('/search', function (req, res) {
    res.render('search', { user: req.user });
});

/*post for search*/
router.post('/search', function (req, res) {
    var form = new formidable.IncomingForm();
    var name = req.body.search;
    articlesModel.find({ make: name }, function (err, foundArticles) {
        console.log(err);
        console.log(foundArticles);
        //Pass found articles from server to pug file
        res.render('search', { articles: foundArticles, user: req.user });
    });
});
module.exports = router;
