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
      // var makeEntry = new entry();
      // makeEntry.programId = "test_third";
      // makeEntry.save();
      // console.log(makeCompetition)
        entry.find({}, function(err, comp) {
      console.log(comp);
    });

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

module.exports = router;
