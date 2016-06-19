var spicyApp1 = angular.module('spicyApp1', ['ui.bootstrap'])
.controller('SpicyCtrl', function($scope, $modal, $http, $window) {

  $scope.spice = 'very';
  $scope.spi = "";

  $scope.chiliSpicy = function() {
    $scope.spice = 'chili';
  };
  $scope.jalapenoSpicy = function() {
    $scope.spice = 'jalapeño';
  };
  $scope.rowCollection = [];
  $scope.showProgram = function(index) {
    console.log(index);
    $window.location.href = '/program' + '?id=' + index._id;
    // $modal.open({
    //   template: '<div class="md">モーダルだよ</div>'
    // });
  };

  //試合データの取得
  $http({
    method: 'GET',
    url: 'db'
  }).then(function successCallback(response) {
    console.log(response.data)
    $scope.rowCollection = response.data;
  }, function errorCallback(response) {
    alert("サーバエラーです")
  });
});
