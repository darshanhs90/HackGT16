var app=angular.module('myApp',[]);
app.controller('myCtrl',function($scope,$http) {
	$scope.dest="";
    $scope.getPlace = function(){
        console.log($scope.dest);
    }
    
		
});
