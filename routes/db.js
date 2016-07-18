var express = require('express');
var router = express.Router();
var global_var = require('./var.js');
var competition = global_var.getCompetitionModel();
var program = global_var.getProgramModel();
var entry = global_var.getEntryModel();
var user = global_var.getUserModel();

router.get('/', function(req, res, next) {
  competition.find({}, function(err, comp) {
    res.json(comp);
  });
});
router.post('/', function(req, res, next) {
  var makeCompetition = new competition(req.body);
  makeCompetition.save();
  res.json({});
});

router.get('/program', function(req, res, next) {
  var id = req.query.id;
  program.find({competitionId:id}, function(err, comp) {
    res.json(comp);
  });
});
router.post('/program', function(req, res, next) {
  var competitionId = req.body.competitionId;
  program.count({competitionId:competitionId}, function(err, num) {
    if(err!=null){
      res.json({err:err});
      next(err);
    }
    var makeProgram = new program(req.body);
    makeProgram.programNum = num+1;
    makeProgram.save();
    res.json({});
  });
});

router.get('/entry', function(req, res, next) {
  var id = req.query.id
  entry.find({programId:id}, function(err, ent) {
    res.json(ent);
  });
});
router.post('/entry', function(req, res, next) {
  var makeEntry = new entry(req.body);
  makeEntry.save();
  res.json({});
});

router.get('/user', function(req, res, next) {
  var id = req.query.id
  console.log(id)
  if(id!=null){
    var query = null;
    if(Array.isArray(id)){
      var queryId = []
      id.forEach(function(i){
        queryId.push({_id:i});
      });
      query = { $or: queryId };
    }
    else{
      query = {_id:id}
    }
    user.find(query, function(err, usr) {
      res.json(usr);
    });
  }
  else{
    user.find({}, function(err, usr) {
      res.json(usr);
    });
  }
});
router.post('/user', function(req, res, next) {
  var makeUser = new user(req.body);
  makeUser.save();
  res.json({});
});

module.exports = router;
