var myApp = angular.module('spicyApp1', ['ui.bootstrap']);
myApp.controller('SpicyCtrl', ['$scope', function($scope){
    $scope.spice = 'very';
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
}]);
