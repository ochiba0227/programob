var express = require('express');
var request = require('request');
var router = express.Router();

router.get('/', function(req, res, next) {
  res.render('admin/index', { title: 'Express' });
});

router.get('/program', function(req, res, next) {
  res.render('admin/program', { title: req.query.title, id:req.query.id });
});

module.exports = router;
