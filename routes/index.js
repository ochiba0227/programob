var express = require('express');
var router = express.Router();
var global_var = require('./var.js');
var competition = global_var.getCompetitionModel();
var entry = global_var.getEntryModel();

  //   var makeCompetition = new competition();
  //   makeCompetition.title = "test_third";
  //   makeCompetition.save();
  //   // console.log(makeCompetition)
  //     competition.find({}, function(err, comp) {
  //   console.log(comp);
  // });
    //   var makeEntry = new entry();
    //   makeEntry.programId = "test_third";
    //   makeEntry.entryData.userId=["aa","bb","cc"];
    //   makeEntry.save();
    //     entry.find({}, function(err, comp) {
    //   console.log(comp[1].entryData.userId[1]);
    // });

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/program', function(req, res, next) {
  res.render('admin', { id: req.query.id });
});

module.exports = router;
