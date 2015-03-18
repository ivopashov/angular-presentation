'use strict';

angular.module('myApp.directiveInheritedScope', ['ngRoute'])
.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/directiveWithInheritedScope', {
    templateUrl: 'directiveWithInheritedScope/directiveInheritedScope.html',
    controller: 'DirectiveInheritedScopeCtrl'
  });
}])
.controller('DirectiveInheritedScopeCtrl',['$scope', function($scope) {
	
	//complex object
	$scope.car={
		make:'fiat',
		hp:500
	};
	
	//simple ojbect
	$scope.color='red';
	
	$scope.alert=function(){
		alert('Coming from the contoller scope');
	}
}])
.directive('inheritedScope',function(){ 
	return {
        scope: true, //use inherit parent scope
        restrict: "E",
        templateUrl: '/app/templates/inheritedScope.html',
    };
})