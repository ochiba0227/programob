var conf = require('config');
var mongoose = require('mongoose');
var db = mongoose.connect(conf.mongodb.url);

module.exports = {
    getDB: function(){
      return db
    }
}
