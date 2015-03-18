'use strict';

angular.module('myApp.isolatedScope', ['ngRoute'])
.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/directiveWithIsolatedScope', {
    templateUrl: 'isolatedScope/isolatedScope.html',
    controller: 'DirectiveIsolatedScopeCtrl'
  });
}])
.controller('DirectiveIsolatedScopeCtrl',['$scope', function($scope) {
	
	//complex object
	$scope.carFiat={
		make:'fiat',
		hp:500
	};
	
	//simple ojbect
	$scope.colorRed='red';
	$scope.colorBlue='blue';
	
	$scope.alert=function(){
		alert('Coming from the contoller scope');
	}
}])
.directive('isolatedDirective',function(){ 
	return {
        scope: {
			carFiat:'=fiat', 
			colorRed:'=red',
			colorBlue:'@blue'
		}, //use inherit parent scope
        restrict: "E",
        templateUrl: '/app/templates/isolatedScope.html',
    };
})
.filter('upper',function(){
	return function (color, areYouSure) {
		if(areYouSure=='yes'){
			var result = color.toUpperCase();
			return result;
		}
		else{
			return color;
		}
        
    }
})