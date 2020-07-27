'use strict';
var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res) {
    res.render('login', { title: 'Inventory' });
});
/* GET login page. */
router.get('/login', function (req, res) {
    res.render('login', { title: 'Inventory' });
});
/* GET Register page. */
router.get('/Register', function (req, res) {
    res.render('Register', { title: 'Inventory' });
});
/* GET create page. */
router.get('/create', function (req, res) {
    res.render('create', { title: 'Inventory' });
});
/* GET read page. */
router.get('/read', function (req, res) {
    res.render('read', { title: 'Inventory' });
});
/* GET update page. */
router.get('/update', function (req, res) {
    res.render('update', { title: 'Services' });
});
/* GET delete page. */
router.get('/delete', function (req, res) {
    res.render('delete', { title: 'About Us' });
});
module.exports = router;
