var express = require('express');
var request = require('request');
var router = express.Router();

router.get('/', function(req, res, next) {
  res.render('index', {isAdmin:true});
});

router.get('/program', function(req, res, next) {
  res.render('program', { title: req.query.title, id:req.query.id, isAdmin:true});
});

router.get('/entry', function(req, res, next) {
  res.render('entry', { title: req.query.title, id:req.query.id, isRelay:req.query.isRelay, isAdmin:true});
});

router.get('/user', function(req, res, next) {
  res.render('user', {isAdmin:true});
});

module.exports = router;
