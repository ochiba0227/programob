var conf = require('config');
var mongoose = require('mongoose');
var db = mongoose.connect(conf.mongodb.url);

// スキーマを定義する
var Schema = db.Schema;

// 試合
var competitionSchema = new Schema({
  title        : String,                          //試合タイトル
  description  : String,                          //試合説明
  day : {type: Date, default: Date.now},          //実施日
  createdDate : {type: Date, default: Date.now},  //作成日
  updatedDate : {type: Date, default: Date.now}   //更新日
});
var competitionModel = db.model(conf.mongodb.schemaName.competiton, competitionSchema);

// プログラム
var programSchema = new Schema({
  competitionId : String,                         //competitionテーブルのid
  programNum : Number,                           //プログラム番号
  distance : Number,                             //距離(m)
  title        : String,                          //自由形など競技名
  description  : String,                          //競技内容
  isRelay : {type:Boolean,default:false},         //リレーならtrue
  createdDate : {type: Date, default: Date.now},  //作成日
  updatedDate : {type: Date, default: Date.now},  //更新日
});
var programModel = db.model(conf.mongodb.schemaName.program, programSchema);

// エントリー
var entrySchema = new Schema({
  programId : String,                             //programテーブルのid
  entryData : {                                   //エントリーデータをjson形式で格納
    userId:[String],                              //ユーザIDを配列形式で格納
    entryTime:Date,                               //エントリータイム
  },
  recordId:String,                               //recordテーブルのid
  createdDate : {type: Date, default: Date.now},  //作成日
  updatedDate : {type: Date, default: Date.now},  //更新日
});
var entryModel = db.model(conf.mongodb.schemaName.entry, entrySchema);

// 記録
var recordSchema = new Schema({
  entryId : String,                                //entryテーブルのID
  programId : String,                             //programテーブルのid
  record : Date,                                  //タイム
  createdDate : {type: Date, default: Date.now},  //作成日
  updatedDate : {type: Date, default: Date.now},  //更新日
});
var recordModel = db.model(conf.mongodb.schemaName.record, recordSchema);

// ユーザ
var userSchema = new Schema({
  userId   : Number,                              //user固有のid
  userName : String,                              //名前
  department : String,                             //学科(M,E,S,I,C)
  graduateYear : Date,                             //卒業(見込み)年度
  createdDate : {type: Date, default: Date.now},  //作成日
  updatedDate : {type: Date, default: Date.now},  //更新日
});
var userModel = db.model(conf.mongodb.schemaName.user, userSchema);

module.exports = {
    getCompetitionModel: function(){
      return competitionModel
    },
    getProgramModel: function(){
      return programModel
    },
    getEntryModel: function(){
      return entryModel
    },
    getRecordModel: function(){
      return recordModel
    },
    getUserModel: function(){
      return userModel
    }
}
