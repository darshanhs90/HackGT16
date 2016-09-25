var app=angular.module('myApp',[]);
app.controller('myCtrl',function($scope,$http) {
    $scope.getPlace = function(){
        console.log($scope.dest);
    }
    

});
