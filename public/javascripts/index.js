var testvalue = "testvalue"
$(function(){
    // /todoにPOSTアクセスする
    $.post('/program', {name: 131, limit: 12123}, function(res){
      console.log(res);
      alert("AAAAA");
      //再度表示する
      //getList();
    });
  getList();
});

// フォームを送信ボタンを押すと、ToDoを追加して再表示する。
$('#spicyForm').submit(function(){
  postList();
  return false;
});

// ToDo一覧を取得して表示する
function getList(){
  // すでに表示されている一覧を非表示にして削除する
  var $list = $('.list');
  $list.fadeOut(function(){
    $list.children().remove();
    // /todoにGETアクセスする
    $.get('todo', function(todos){
      // 取得したToDoを追加していく
      $.each(todos, function(index, todo){
        var limit = new Date(todo.limitDate);
        $list.append('<p><input type="checkbox" ' + (todo.isCheck ? 'checked' : '') + '>' + todo.text + ' (~' + limit.toLocaleString() + ')</p>');
      });
      // 一覧を表示する
      $list.fadeIn();
    });
  });


}

// フォームに入力されたToDoを追加する
function postList(){
  console.log("AAAA")
  // フォームに入力された値を取得
  var name = $('#exampleInputName2').val();
  var limitDate = new Date();

  //入力項目を空にする
  $('#exampleInputName2').val('');
  $('#exampleInputName3').val('');
  alert(name);
  alert(limitDate);

  // /todoにPOSTアクセスする
  $.post('/todo', {name: name, limit: limitDate}, function(res){
    console.log(res);
    alert("AAAAA");
    //再度表示する
    //getList();
  });
}
