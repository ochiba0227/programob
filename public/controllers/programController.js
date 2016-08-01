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
  var exportStartList = $("#exportStartList")[0];

  //スタートリストの出力
  exportStartList.addEventListener("click",exportCSV);

  //csvの出力
  function exportCSV(){
    $.ajax({
      method: 'GET',
      url: '/db/program',
      data: "id="+competitionId //req.queryにデータを渡すとき
    }).done(function(programs) {
      getEntry(programs);
    });
  }

  // エントリーを取得
  function getEntry(programs){
    var startList = [];
    $.each(programs,function(){
      $.ajax({
        method: 'GET',
        url: '/db/entry',
        data: "id="+this._id //req.queryにデータを渡すとき
      }).done(function(entries) {
        $.each(entries,function(i){
          $.ajax({
            method: 'GET',
            url: '/db/user',
            data: "uid="+this.entryData.userId
          }).done(function(ret){
            ret[0]["entryTime"] = entries[i].entryData.entryTime;
            ret[0]["obYear"] = getOBYear(ret[0].graduateYear)
            entries[i].entryData=ret[0];
          });
        });
        startList.push(entries);
      });
    });
    // 通信が全部終わったらcsvへ書き出し
    $(document).ajaxStop(function (e) {
      var content = '';
      $.each(startList,function(i){
        // console.log(programs[i].distance+"m "+programs[i].title)
        content += programs[i].distance+"m "+programs[i].title + "\n";
        $.each(getStartList(this).reverse(),function(j){
          // console.log((j+1)+"組")
          content += (j+1)+"組\n";
          $.each(this,function(k){
            // console.log(this.entryData)
            if(typeof this.entryData!=="undefined"){
              content += (k+1)+","+this.entryData.userName+","+dateToFormatStr(this.entryData.entryTime)
              + "," + getOBYear(this.entryData.graduateYear) + "," + this.entryData.department +"\n";
            }
            else{
              content += (k+1)+",\n";
            }
          });
        });
      });
      var blob = new Blob([ content ], { "type" : "text/csv" });

      if (window.navigator.msSaveBlob) {
          window.navigator.msSaveBlob(blob, "test.txt");
          // msSaveOrOpenBlobの場合はファイルを保存せずに開ける
          window.navigator.msSaveOrOpenBlob(blob, "test.txt");
      } else {
          $("#download").show();
          $("#download")[0].href = window.URL.createObjectURL(blob);
      }
    });
  }

  //ユーザ名の取得
  function getUserName(entry){
    var uid = null;
    if(typeof entry.entryData!=="undefined"){
      uid = entry.entryData.userId;
    }
    return $.ajax({
      method: 'GET',
      url: '/db/user',
      data: "uid="+uid
    });
  }

  // スタートリストの作成
  function getStartList(entries){
      // コース番号をどっかでまとめて設定したほうが良い
      var courseNum = 6;

      //エントリータイムが同じ場合にランダムになってしまうので、先行してid昇順ソート
      entries.sort(function(a,b){
        if( a._id < b._id ) return -1;
        if( a._id > b._id ) return 1;
        return 0;
      });

      //タイム昇順ソート
      entries.sort(function(a,b){
        if( a.entryData.entryTime < b.entryData.entryTime ) return -1;
        if( a.entryData.entryTime > b.entryData.entryTime ) return 1;
        return 0;
      });

      entryRows = [];
      var classNum = 0;
      var indexes = [];
      var center = Math.floor(courseNum/2);
      var counter = 0;
      for(var i = 0; i<courseNum; i++){
        if(i%2==0){
          indexes.push(center+counter);
        }
        else{
          counter++;
          indexes.push(center-counter);
        }
      }
      //一時的に変更！！！！！
      indexes = [3,4,2,5,1,6];
      var length = entries.length;

      while(length!=0){
        var loopNum = courseNum;
        entryRows[classNum]=new Array(courseNum);
        // 3コース以上のプールで、普通にやると1組が3人未満になってしまう場合を考慮
        if(courseNum>3&&length/courseNum>1&&length/courseNum<2){
          var mod = length%courseNum;
          if(mod<=2){
            loopNum = courseNum-(3-mod);
          }
        }
        for(var i = 0; i<loopNum; i++){
          entryRows[classNum][indexes[i]] = entries[0];
          entries.shift();
        }
        classNum+=1;
        length = entries.length;
      }
      return entryRows;
  }

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
            if(programTitle==null || programTitle==="" || !entryObj[programTitle]){
              // continueと等価
              return true;
            }
            var entryTime = timeStrToDate(entryData[entryIndex][this["entryTime"]]);
            // どうやらタイムがなくても登録したいらしい。
            if(entryTime==null){
              // continueと等価
              // return true;
              entryTime = timeStrToDate("99:59.999");
            }
            var entryDataObj = {"userId":userId,"entryTime":entryTime};
            // entryDataObj["userId"] = userId;
            // entryDataObj["entryTime"] = entryTime;
            // entryObj[programTitle]["entryData"].push(entryDataObj);

            addEntryData(entryObj[programTitle],entryDataObj);
          });
        });
        window.location.href = window.location.href;
      }
    },false);
});
