var programApp = angular.module('programApp', ['ui.bootstrap'])
.controller('programController', function($scope, $modal, $http, $window) {
  $scope.rowCollection = [];

  $scope.competitionTitle = '';
  $scope.programTitle = '';
  $scope.programDescription = '';
  $scope.programDate = new Date();
  $scope.datePickerOpen = false;
  $scope.toggleDatePicker = function($event) {
    $event.stopPropagation();
    $scope.datePickerOpen = !$scope.datePickerOpen;
  };

  $scope.addProgram = function() {
    $http({
      method: 'POST',
      url: '/db/program',
      data: {
        competitionId: competitionId,
        title: $scope.programTitle,
        description: $scope.programDescription,
        distance: $scope.programDistance,
        isRelay:$scope.programRelay
      }
    }).then(function successCallback(response) {
      console.log(competitionId)
      $scope.programTitle = '';
      $scope.programDescription = '';
      $scope.programDistance = '';
      $scope.programRelay = false;
      $scope.showProgram();
      $modal.open({
        template: '<div class="md">追加が完了しました！</div>'
      });
    }, function errorCallback(response) {
      alert("サーバエラーです")
    });
  };

    $scope.addProgramFromFile = function() {
      alert("ASFAFSD")
      // $.each(response.data,function(i){
      //   var httpPromise = $http({
      //     method: 'POST',
      //     url: '/db/program',
      //     data: {
      //       competitionId: competitionId,
      //       title: $scope.programTitle,
      //       description: $scope.programDescription,
      //       distance: $scope.programDistance,
      //       isRelay:$scope.programRelay
      //     }
      //   });
      // requestPromise.push(httpPromise);
      // });
      // $q.all(requestPromise).then(function() {
      //   $scope.showProgram();
      //   $modal.open({
      //     template: '<div class="md">追加が完了しました！</div>'
      //   });
      // });
    }

  $scope.showEntry = function(index) {
    var title = encodeURIComponent('No.'+index.programNum+' '+index.distance+'m '+index.title);
    var url = '/entry' + '?id=' + index._id + '&title=' + title + '&isRelay=' + index.isRelay;
    if(isAdmin){
       url = '/admin'+url;
    }
    $window.location.href = url;
  };

  //試合データの取得
  $scope.showProgram = function(index) {
    $http({
      method: 'GET',
      url: '/db/program',
      params: {id:competitionId} //req.queryにデータを渡すとき
    }).then(function successCallback(response) {
      $scope.rowCollection = response.data;
    }, function errorCallback(response) {
      alert("showProgramサーバエラーです"+response.data)
    });
  }
  $scope.showProgram();
});

$(function(){
  var csvFile = $("#csvFile")[0];
  var tsvFile = $("#tsvFile")[0];

  //プログラムを追加するための入力ファイルは距離,種目名,リレーかどうかのフラグからなる
  csvFile.addEventListener("change",function(evt){
    var file = evt.target.files;

    //FileReaderの作成
    var reader = new FileReader();
    //テキスト形式で読み込む
    reader.readAsText(file[0]);

    //読込終了後の処理
    reader.onload = function(ev){
      var csv = convertCSVtoArray(reader.result);
      $.each(csv,function(){
         $.ajax({
            method: 'POST',
            url: '/db/program',
            async:false,
            data: {
              competitionId: competitionId,
              title: this[1],
              description: "",
              distance: this[0],
              isRelay:Boolean(Number(this[2]))
            }
         });
      });
      window.location.href = window.location.href;
    }
  },false);

    //エントリーを追加するための入力ファイルはgoogleフォームの内容からなる
    //https://docs.google.com/spreadsheets/d/1TjynES88GcLJLJmPtIMUdr38Ghy7JLEgcYjCPEo-ulQ/edit?ts=57760233#gid=2008621515
    tsvFile.addEventListener("change",function(evt){
      var file = evt.target.files;

      //tsvかどうかのバリデーションなどなど今後追加

      //FileReaderの作成
      var reader = new FileReader();
      //テキスト形式で読み込む
      reader.readAsText(file[0]);

      //読込終了後の処理
      reader.onload = function(ev){
        var entryData = convertTSVtoArray(reader.result);

        // ヘッダ行を削除
        var header = entryData.shift();
        var dataIndexes = [];
        var nums = ["①","②","③"];

        // 種目名とエントリータイムが格納されているインデックスを取得
        $.each(nums,function(){
          if(header.indexOf("種目"+this) >= 0&&header.indexOf("エントリータイム"+this) >= 0){
              var obj = new Object();
              obj["programTitle"] = header.indexOf("種目"+this);
              obj["entryTime"] = header.indexOf("エントリータイム"+this)
              dataIndexes.push(obj);
          }
        });

        var programList = [];
        //プログラムリストを取得
        $.ajax({
          method: 'GET',
          url: '/db/program',
          async:false,
          data: "id="+competitionId,
          success: function(msg){
            programList=msg;
          }
        });

        // プログラム名をキーにidを格納するオブジェクトを作成
        var entryObj = new Object();
        $.each(programList,function(){
          var key = this.distance+"m "+this.title;
          // entryObj[key] = new Object();
          // entryObj[key]["programId"] = this._id;
          // entryObj[key]["entryData"] = [];
          entryObj[key] = this._id;
        });

        // エントリーデータをDBへ格納
        $.each(entryData,function(entryIndex){
          // userIdを取得し、ユーザが存在しなければ追加する
          var userId = getUserId(this,header);

          if(userId==null){
            alert(this[header.indexOf("参加者情報")]+"さんのユーザIDを入力してください！！！！")
            return false;
          }

          $.each(dataIndexes,function(){
            var programTitle = entryData[entryIndex][this["programTitle"]];
            if(programTitle===""||!entryObj[programTitle]){
              // continueと等価
              return true;
            }
            var entryTime = timeStrToDate(entryData[entryIndex][this["entryTime"]]);
            if(entryTime==null){
              // continueと等価
              return true;
            }
            var entryDataObj = {"userId":userId,"entryTime":entryTime};
            // entryDataObj["userId"] = userId;
            // entryDataObj["entryTime"] = entryTime;
            // entryObj[programTitle]["entryData"].push(entryDataObj);
            addEntryData(entryObj[programTitle],entryDataObj);
          });
        });
        //window.location.href = window.location.href;
      }
    },false);
});
