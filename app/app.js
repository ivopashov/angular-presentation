'use strict';

// Declare app level module which depends on views, and components
angular.module('myApp', [
  'ngRoute',
  'myApp.wizard',
  'myApp.thirdPartyComponent',
  'myApp.directiveInheritedScope',
  'myApp.isolatedScope',
  'myApp.testTable',
  'myApp.date'
]).
config(['$routeProvider', function($routeProvider) {
  $routeProvider.otherwise({redirectTo: '/wizard'});
}]);
