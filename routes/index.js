var express = require('express');
var router = express.Router();
var global_var = require('./var.js');
var db = global_var.getDB();

// ToDoスキーマを定義する
var Schema = db.Schema;
var todoSchema = new Schema({
  isCheck     : {type: Boolean, default: false},
  text        : String,
  createdDate : {type: Date, default: Date.now},
  limitDate   : Date
});
db.model('Todo', todoSchema);

// /todoにGETアクセスしたとき、ToDo一覧を取得するAPI
router.get('/todo', function(req, res) {
  var Todo = db.model('Todo');
  // すべてのToDoを取得して送る
  Todo.find({}, function(err, todos) {
    res.send(todos);
  });
});


// /todoにPOSTアクセスしたとき、ToDoを追加するAPI
router.post('/todo', function(req, res) {
  console.log("inininininin");
  var name = req.body.name;
  var limit = req.body.limit;
  // ToDoの名前と期限のパラーメタがあればMongodbに保存
  console.log("inininininin");
  if(name && limit) {
    var Todo = db.model('Todo');
    var todo = new Todo();
    todo.text = name;
    todo.limitDate = limit;
    todo.save();
    console.log(todo)

    res.send(true);
  } else {
    res.send(false);
  }
});

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

module.exports = router;
