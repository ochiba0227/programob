var userApp = angular.module('userApp', ['ui.bootstrap'])
.controller('userCtrl', function($scope, $modal, $http, $window) {
  $scope.rowCollection = [];

  $scope.userName = '';
  $scope.sex = '';
  $scope.sexList = ['M','F'];
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

  $scope.toggleDatePickerMod = function($event){
    $event.stopPropagation();
    $scope.datePickerOpenMod = !$scope.datePickerOpenMod;
  }

  $scope.showModModal = function(row){
    // DBが管理している方のidを取得
    $scope.user_id = row._id;
    $scope.modModal = $modal.open({
      template: '<h2>'+row.userName+'さんの情報を編集します</h2>'+
      '<div class="row">'+
      '<div class="col-lg-12">'+
      '<form id="userForm" ng-submit="$parent.updateUser()">'+
      '<div class="form-group">'+
      '<label for="userIdMod">ユーザ名</label>'+
      '<input type="text" class="form-control" id="userIdMod" ng-model="$parent.userIdMod" ng-init="$parent.userIdMod=\''+row.userId+'\'" required/>'+
      '</div>'+
      '<div class="form-group">'+
      '<label for="userName">ユーザ名</label>'+
      '<input type="text" class="form-control" id="userName" ng-model="$parent.userNameMod" ng-init="$parent.userNameMod=\''+row.userName+'\'" required/>'+
      '</div>'+
      '<div class="form-group">'+
      '<label for="sex">性別</label>'+
      '<select class="form-control" id="sex" ng-model="$parent.sexMod" ng-options="s for s in $parent.sexList" required ng-init="$parent.sexMod=\''+row.sex+'\'">'+
      '<option value="">-選択してください-</option>'+
      '</select>'+
      '</div>'+
      '<div class="form-group">'+
      '<label for="department">学科</label>'+
      '<select class="form-control" id="department" ng-model="$parent.departmentMod" ng-options="d for d in $parent.departments" required ng-init="$parent.departmentMod=\''+row.department+'\'">'+
      '<option value="">-選択してください-</option>'+
      '</select>'+
      '</div>'+
      '<div class="form-group">'+
      '<label for="graduateYear">卒業（見込み）年度</label>'+
      '<div class="input-group" required>'+
      '<input type="text" class="form-control" id="graduateYear" ng-model="$parent.graduateYearMod" datepicker-mode="\'year\'" datepicker-options="$parent.dateOptions" datepicker-popup="yyyy" is-open="$parent.datePickerOpenMod" required ng-click="toggleDatePickerMod($event)" ng-init="$parent.graduateYearMod=\''+row.graduateYear+'\'"></input>'+
      '<span class="input-group-addon glyphicon glyphicon-calendar" ng-click="toggleDatePickerMod($event)"></span>'+
      '</div>'+
      '</div>'+
      '<button type="submit" class="btn btn-primary"> ユーザの情報を変更する</button>'+
      '</form>'+
      '</div>'+
      '</div>',
      scope:$scope
    });
  }

  // ユーザ情報の更新
  $scope.updateUser = function(){
    var graduateYearDate = new Date($scope.graduateYearMod)
    $http({
      method: 'POST',
      url: '/db/user',
      data: {
        userId : $scope.userIdMod,
        userName: $scope.userNameMod,
        sex: $scope.sexMod,
        department: $scope.departmentMod,
        graduateYear: graduateYearDate+graduateYearDate.getTimezoneOffset(), //日本時間に変換
        _id : $scope.user_id,
        isUpdate: true
      }
    }).then(function successCallback(response) {
      $scope.modModal.close();
      $scope.showUser();
      $modal.open({
        template: '<div class="md">変更が完了しました！</div>'
      });
    }, function errorCallback(response) {
      alert("サーバエラーです")
    });
  }

  // ユーザの削除
  $scope.deleteUser = function(){
    alert("delete予定")
  }

  // ユーザの追加
  $scope.addUser = function() {
    $http({
      method: 'POST',
      url: '/db/user',
      data: {
        userId : $scope.userId,
        userName: $scope.userName,
        sex: $scope.sex,
        department: $scope.department,
        graduateYear: $scope.graduateYear+$scope.graduateYear.getTimezoneOffset() //日本時間に変換
      }
    }).then(function successCallback(response) {
      $scope.userId = '';
      $scope.userName = '';
      $scope.sex = '';
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
