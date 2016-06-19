var spicyApp1 = angular.module('spicyApp1', ['ui.bootstrap'])
.controller('SpicyCtrl', function($scope, $modal, $http, $window) {
  $scope.spi = '';
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
    console.log("ASFDASFAS")
    $http({
      method: 'POST',
      url: 'db',
      data: {
        title: $scope.competitionTitle,
        description: $scope.competitionDescription,
        day: $scope.competitionDate
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
    $window.location.href = '/admin/program' + '?id=' + index._id;
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
