var express = require('express');
var request = require('request');
var router = express.Router();

router.get('/', function(req, res, next) {
  res.render('admin/index', {});
});

router.get('/program', function(req, res, next) {
  res.render('admin/program', { title: req.query.title, id:req.query.id });
});

router.get('/entry', function(req, res, next) {
  res.render('admin/entry', { title: req.query.title, id:req.query.id });
});

router.get('/user', function(req, res, next) {
  res.render('admin/user', {});
});

module.exports = router;
