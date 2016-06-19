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

router.get('/', function(req, res, next) {
  competition.find({}, function(err, comp) {
    res.json(comp);
  });
});
router.post('/', function(req, res, next) {
  console.log(req.body)
  var makeCompetition = new competition(req.body);
  makeCompetition.save();
  res.json({});
});

router.get('/program', function(req, res, next) {
  var id = req.query.id
  competition.findOne({_id:id}, function(err, comp) {
    res.json(comp);
  });
});

module.exports = router;
