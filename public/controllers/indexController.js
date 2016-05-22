var spicyApp1 = angular.module('spicyApp1', ['ui.bootstrap'])
.controller('SpicyCtrl', function($scope, $modal) {
    $scope.spice = 'very';
    $scope.spi = 've';
    $scope.chiliSpicy = function() {
        $scope.spice = 'chili';
    };
    $scope.jalapenoSpicy = function() {
        $scope.spice = 'jalapeño';
    };
    $scope.rowCollection = [
        {firstName: 'Laurent', lastName: 'Renard', birthDate: new Date('1987-05-21'), balance: 102, email: 'whatever@gmail.com'},
        {firstName: 'Blandine', lastName: 'Faivre', birthDate: new Date('1987-04-25'), balance: -2323.22, email: 'oufblandou@gmail.com'},
        {firstName: 'Francoise', lastName: 'Frere', birthDate: new Date('1955-08-27'), balance: 42343, email: 'raymondef@gmail.com'}
    ];
    $scope.methodA = function(index) {
      console.log(index);
      $modal.open({
        template: '<div class="md">モーダルだよ</div>'
      });
    };
});
