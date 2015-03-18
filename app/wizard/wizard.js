'use strict';

angular.module('myApp.wizard', ['ngRoute'])
.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/wizard', {
    templateUrl: 'wizard/wizard.html',
    controller: 'WizardCtrl'
  });
}])
.controller('WizardCtrl',['$scope', function($scope) {
	
	$scope.user={
		personalData:{},
		address:{}
	};
	
	$scope.regProcess={
		step:1
	};
	
	$scope.increaseStep=function(){
		$scope.regProcess.step++;
	}
	$scope.decreaseStep=function(){
		$scope.regProcess.step--;
	}
	$scope.save=function(){
		alert('user saved');
	}
}])
.directive('userInfo',function(){ 
	return {
        scope: false, //use parent scope. Any changes from directive are reflected in the parent and vice versa
        restrict: "E",
        templateUrl: '/app/templates/userInfo.html',
    };
})
.directive('userAddress',function(){ 
	return {
        scope: false, //use parent scope. Any changes from directive are reflected in the parent and vice versa
        restrict: "E",
        templateUrl: '/app/templates/userAddress.html',
    };
})