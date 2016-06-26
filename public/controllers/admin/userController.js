var userApp = angular.module('userApp', ['ui.bootstrap'])
.controller('userCtrl', function($scope, $modal, $http, $window) {
  $scope.rowCollection = [];

  $scope.userName = '';
  $scope.department = '';
  $scope.departments = ['M','E','S','I','C'];
  $scope.graduateYear = '';
  $scope.datePickerOpen = false;
  $scope.toggleDatePicker = function($event) {
    $event.stopPropagation();
    $scope.datePickerOpen = !$scope.datePickerOpen;
  };
  $scope.formats = ['yyyy'];
  $scope.format = $scope.formats[0];
  $scope.dateOptions = {
    formatYear: 'yyyy',
    startingDay: 1,
    minMode: 'year'
  };

  $scope.addUser = function() {
    $http({
      method: 'POST',
      url: '/db/user',
      data: {
        userName: $scope.userName,
        department: $scope.department,
        graduateYear: $scope.graduateYear+$scope.graduateYear.getTimezoneOffset() //日本時間に変換
      }
    }).then(function successCallback(response) {
      $scope.userName = '';
      $scope.department = '';
      $scope.graduateYear = '';
      $scope.showUser();
      $modal.open({
        template: '<div class="md">追加が完了しました！</div>'
      });
    }, function errorCallback(response) {
      alert("サーバエラーです")
    });
  };

  //ユーザの取得
  $scope.showUser = function(index) {
    $http({
      method: 'GET',
      url: '/db/user'
    }).then(function successCallback(response) {
      console.log(response.data)
      $scope.rowCollection = response.data;
    }, function errorCallback(response) {
      alert("サーバエラーです")
    });
  }
  $scope.showUser();
});
