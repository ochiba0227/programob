var entryApp = angular.module('entryApp', ['ui.bootstrap'])
.controller('entryController', function($scope, $modal, $http, $window, $q) {
  $scope.rowCollection = [];

  //使用するコース数
  $scope.courseNum = 6;

  $scope.showRanking = false;
  $scope.rankingCollection = [];

  $scope.users = [];
  $scope.entryTime = '';

  // ランキングと表示切替
  $scope.toggleShowRanking = function(){
    $scope.showRanking = !$scope.showRanking;
  }

  $scope.makeTime = function(entryTime){
    if(entryTime==null){
      return null;
    }
    var time=0;
    if(typeof entryTime[1] !== "undefined"){
      time = Number(entryTime[1])*60000;//分をミリ秒で
      time += Number(entryTime[2])*1000;//秒をミリ秒で
      time += Number(entryTime[3]);//ミリ秒
    }
    else if(typeof entryTime[4] !== "undefined"){
      time = Number(entryTime[4])*1000;//秒をミリ秒で
      time += Number(entryTime[5]);//ミリ秒
    }
    else if(typeof entryTime[6] !== "undefined"){
      time = Number(entryTime[6])*1000;//秒をミリ秒で
    }
    //0が入力された場合
    // 0の場合nanではないのでfalse
    if(Number.isNaN(time)){
      return null;
    }
    return new Date(time);
  }

  $scope.makeUserID = function(users){
    var userIDList=[];
    $.each(users,function(){
      userIDList.push(this.userId);
    });
    return userIDList;
  }

  // タイムを更新
  $scope.updateRecord = function(index) {
    var time = $("#time_"+index._id).val().match(/^(\d{1,3}):(\d{1,2}).(\d{1,3})$|^(\d{1,2}).(\d{1,3})$|^(\d{1,2})$/);
    var record = $scope.makeTime(time)
    if(record==null){
      $modal.open({
        template: '<div class="md">フォーマット通りに時間を入力してください！</div>'
      });
      return;
    }

    //サーバへポスト
    $http({
      method: 'POST',
      url: '/db/entry',
      data: {
        entryId:index._id,
        record:record,
        isRecord:true
      }
    }).then(function successCallback(response) {
      $scope.showEntry();
      $modal.open({
        template: '<div class="md">追加が完了しました！</div>'
      });
    }, function errorCallback(response) {
      alert("サーバエラーです")
    });
  }

    // タイムを削除
    $scope.deleteRecord = function(index,courseNum) {
       var myRet = confirm(courseNum + "コースのタイムを削除してよろしいですか？");
       if ( myRet == false ){
           return;
       }
      //サーバへポスト
      $http({
        method: 'POST',
        url: '/db/entry',
        data: {
          entryId:index._id,
          record:undefined,
          isRecord:true
        }
      }).then(function successCallback(response) {
        $scope.showEntry();
        $modal.open({
          template: '<div class="md">削除が完了しました！</div>'
        });
      }, function errorCallback(response) {
        alert("サーバエラーです")
      });
    }

  $scope.addEntry = function() {
    var time = $scope.entryTime.match(/^(\d{1,3}):(\d{1,2}).(\d{1,3})$|^(\d{1,2}).(\d{1,3})$|^(\d{1,2})$/);
    var entryTime = $scope.makeTime(time)
    if(entryTime==null){
      $modal.open({
        template: '<div class="md">フォーマット通りに時間を入力してください！</div>'
      });
      return;
    }

    //リレーでなく人数が1人以上の場合
    if(!isRelay&&$scope.user.length!=1){
      $modal.open({
        template: '<div class="md">リレーではないので選手は一人です!</div>'
      });
      return;
    }

    $http({
      method: 'POST',
      url: '/db/entry',
      data: {
        programId:programId,
        entryData:{userId:$scope.makeUserID($scope.user),entryTime:entryTime}
      }
    }).then(function successCallback(response) {
      $scope.user = '';
      $scope.entryTime = '';
      $scope.showEntry();
      // $modal.open({
      //   template: '<div class="md">追加が完了しました！</div>'
      // });
      alert("追加が完了しました！")
    }, function errorCallback(response) {
      alert("サーバエラーです")
    });
  };

  //時間のフォーマット
  $scope.formatDate = function (date) {
    if(date==null){
      return null;
    }
    date = new Date(date);
    minute = (date.getHours()-9)*60 + date.getMinutes();
    second = ('0' + date.getSeconds()).slice(-2);
    milliSecond = (date.getMilliseconds()+'00').slice(0,3);

    if(minute!=0){
      return minute+':'+second+'.'+milliSecond;
    }
    return second+'.'+milliSecond;
  };

  //エントリーデータの取得
  $scope.showEntry = function() {
    $http({
      method: 'GET',
      url: '/db/entry',
      params:{id:programId}
    }).then(function successCallback(response) {
      var requestPromise = [];
      $scope.rowCollection = [];
      $.each(response.data,function(i){
        var httpPromise = $http({
          method: 'GET',
          url: '/db/user',
          params: {uid:response.data[i].entryData.userId}
        }).then(function successCallback(responseUser) {
          response.data[i].entryData.userData = responseUser.data;
          $scope.rowCollection.push(response.data[i]);
        }, function errorCallback(response) {
          alert("サーバエラーです")
        });
        requestPromise.push(httpPromise);
      });
      $q.all(requestPromise).then(function() {
        $scope.makeRanking();
        $scope.makeClass();
      });
    }, function errorCallback(response) {
      alert("サーバエラーです"+response.data)
    });
  }

  //ランキング作成
  $scope.makeRanking = function() {
    //エントリータイムが同じ場合にランダムになってしまうので、先行してid昇順ソート
    $scope.rankingCollection = angular.copy($scope.rowCollection);
    $scope.rankingCollection.sort(function(a,b){
      if( typeof a.record === "undefined" ) return 1;
      if( typeof b.record === "undefined" ) return -1;
      if( a.record < b.record ) return -1;
      if( a.record > b.record ) return 1;
      return 0;
    });
  }

  //組分け
  $scope.makeClass = function() {
    //エントリータイムが同じ場合にランダムになってしまうので、先行してid昇順ソート
    $scope.rowCollection.sort(function(a,b){
      if( a._id < b._id ) return -1;
      if( a._id > b._id ) return 1;
      return 0;
    });

    //タイム昇順ソート
    $scope.rowCollection.sort(function(a,b){
      if( a.entryData.entryTime < b.entryData.entryTime ) return -1;
      if( a.entryData.entryTime > b.entryData.entryTime ) return 1;
      return 0;
    });

    $scope.entryRows = [];
    var classNum = 0;
    var indexes = [];
    var center = Math.floor($scope.courseNum/2);
    var counter = 0;
    for(var i = 0; i<$scope.courseNum; i++){
      if(i%2==0){
        indexes.push(center+counter);
      }
      else{
        counter++;
        indexes.push(center-counter);
      }
    }
    var length = $scope.rowCollection.length;

    while(length!=0){
      var loopNum = $scope.courseNum;
      $scope.entryRows[classNum]=new Array($scope.courseNum);
      // 3コース以上のプールで、普通にやると1組が3人未満になってしまう場合を考慮
      if($scope.courseNum>3&&length/$scope.courseNum>1&&length/$scope.courseNum<2){
        var mod = length%$scope.courseNum;
        if(mod<=2){
          loopNum = $scope.courseNum-(3-mod);
        }
      }
      for(var i = 0; i<loopNum; i++){
        $scope.entryRows[classNum][indexes[i]] = $scope.rowCollection[0];
        $scope.rowCollection.shift();
      }
      classNum+=1;
      length = $scope.rowCollection.length;
    }
  }

  //ユーザの取得
  $scope.getUsers = function() {
    $http({
      method: 'GET',
      url: '/db/user'
    }).then(function successCallback(response) {
      $scope.users = response.data;
    }, function errorCallback(response) {
      alert("サーバエラーです")
    });
  }

  //ユーザの取得
  $scope.getUserName = function(userIdList) {
    $http({
      method: 'GET',
      url: '/db/user',
      params: {id:userIdList}
    }).then(function successCallback(response) {
      return response.data;
    }, function errorCallback(response) {
      alert("サーバエラーです")
    });
  }

  $scope.getUsers();
  $scope.showEntry();
});
