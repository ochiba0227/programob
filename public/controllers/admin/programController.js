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


  $scope.showEntry = function(index) {
    var title = encodeURIComponent('No.'+index.programNum+' '+index.title);
    $window.location.href = '/admin/entry' + '?id=' + index._id + '&title=' + title;
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
