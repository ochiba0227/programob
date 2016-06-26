var entryApp = angular.module('entryApp', ['ui.bootstrap'])
.controller('entryController', function($scope, $modal, $http, $window) {
  $scope.rowCollection = [];

  $scope.users = [];
  $scope.entryTime = '';

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
      time = Number(entryTime[2])*1000;//秒をミリ秒で
      time += Number(entryTime[3]);//ミリ秒
    }
    //0が入力された場合
    if(Number.isNaN(time)){
      return null;
    }
    return new Date(time);
  }

  $scope.makeUserID = function(users){
    var userIDList=[];
    $.each(users,function(){
      userIDList.push(this._id);
    });
    return userIDList;
  }

  $scope.addEntry = function() {
    console.log($scope.entryTime.match(/^(\d{1,3}):(\d{1,2}).(\d{1,3})$|^(\d{1,2}).(\d{1,3})$/))
    var time = $scope.entryTime.match(/^(\d{1,3}):(\d{1,2}).(\d{1,3})$|^(\d{1,2}).(\d{1,3})$/);
    var entryTime = $scope.makeTime(time)
    if(entryTime==null){
      $modal.open({
        template: '<div class="md">0秒以外の時間を入力してください！</div>'
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
      $modal.open({
        template: '<div class="md">追加が完了しました！</div>'
      });
    }, function errorCallback(response) {
      alert("サーバエラーです")
    });
  };

  //時間のフォーマット
  $scope.formatDate = function (date) {
    date = new Date(date);
    minute = (date.getHours()-9)*60 + date.getMinutes();
    second = ('0' + date.getSeconds()).slice(-2);
    milliSecond = ('00' + date.getMilliseconds()).slice(-3);
    return minute+':'+second+'.'+milliSecond;
};

  //エントリーデータの取得
  $scope.showEntry = function() {
    $http({
      method: 'GET',
      url: '/db/entry',
      params:{id:programId}
    }).then(function successCallback(response) {
      $scope.rowCollection = [];
      $.each(response.data,function(i){
        $http({
          method: 'GET',
          url: '/db/user',
          params: {id:response.data[i].entryData.userId}
        }).then(function successCallback(responseUser) {
          response.data[i].entryData.userData = responseUser.data;
          response.data[i].entryData.entryTime = $scope.formatDate(response.data[i].entryData.entryTime);
          $scope.rowCollection.push(response.data[i]);
        }, function errorCallback(response) {
          alert("サーバエラーです")
        });
      });
    }, function errorCallback(response) {
      alert("サーバエラーです"+response.data)
    });
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
