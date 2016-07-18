var indexApp = angular.module('indexApp', ['ui.bootstrap'])
.controller('indexController', function($scope, $modal, $http, $window) {
  $scope.filter = '';
  $scope.rowCollection = [];

  $scope.competitionTitle = '';
  $scope.competitionDescription = '';
  $scope.competitionDate = new Date();
  $scope.datePickerOpen = false;
  $scope.toggleDatePicker = function($event) {
    $event.stopPropagation();
    $scope.datePickerOpen = !$scope.datePickerOpen;
  };

  $scope.addCompetiton = function() {
    $http({
      method: 'POST',
      url: 'db',
      data: {
        title: $scope.competitionTitle,
        description: $scope.competitionDescription,
        day: $scope.competitionDate+$scope.competitionDate.getTimezoneOffset() //日本時間に変換
      }
    }).then(function successCallback(response) {
      $scope.competitionTitle = '';
      $scope.competitionDescription = '';
      $scope.competitionDate = '';
      $scope.showCometition();
      $modal.open({
        template: '<div class="md">追加が完了しました！</div>'
      });
    }, function errorCallback(response) {
      alert("サーバエラーです")
    });
  };


  $scope.showProgram = function(index) {
    console.log(index);
    var url = '/program' + '?id=' + index._id + '&title=' + index.title;
    if(isAdmin){
       url = '/admin'+url;
    }
    $window.location.href = url;
  };

  //試合データの取得
  $scope.showCometition = function(index) {
    $http({
      method: 'GET',
      url: 'db'
    }).then(function successCallback(response) {
      console.log(response.data)
      $scope.rowCollection = response.data;
    }, function errorCallback(response) {
      alert("サーバエラーです")
    });
  }
  $scope.showCometition();
});
