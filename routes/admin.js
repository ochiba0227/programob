var express = require('express');
var request = require('request');
var router = express.Router();

router.get('/', function(req, res, next) {
  res.render('admin/index', { title: 'Express' });
});

router.get('/program', function(req, res, next) {
  console.log(req.query)
  var resParent=res;
  request.get(
    {
      url:'http://' + req.headers.host + '/db/program',
      qs:req.query},
    function (err, res, body) {
        if (!err && res.statusCode == 200) {
            var data = JSON.parse(res.body)
            resParent.render('admin/program', { title: data.title });
        } else {
          console.log("エラー！！！");
        }
    }
  );
});

module.exports = router;
