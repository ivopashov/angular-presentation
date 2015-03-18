'use strict';

angular.module('myApp.testTable', ['ngRoute'])
.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/testTable', {
    templateUrl: 'testTable/testTable.html',
    controller: 'TestTableCtrl'
  });
}])
.controller('TestTableCtrl',['$scope', function($scope) {
	$scope.data = [
        { name: 'pesho', city: 'sofia', age: 25, grade: 3 },
        { name: 'gosho', city: 'plovdiv', age: 27, grade: 9 },
        { name: 'niki', city: 'varna', age: 29, grade: 11 },
        { name: 'pesho', city: 'sofia', age: 25, grade: 3 },
        { name: 'gosho', city: 'plovdiv', age: 27, grade: 9 },
        { name: 'niki', city: 'varna', age: 29, grade: 11 },
        { name: 'pesho', city: 'sofia', age: 25, grade: 3 },
        { name: 'gosho', city: 'plovdiv', age: 27, grade: 9 },
        { name: 'niki', city: 'varna', age: 29, grade: 11 },
        { name: 'pesho', city: 'sofia', age: 25, grade: 3 },
        { name: 'gosho', city: 'plovdiv', age: 27, grade: 9 },
        { name: 'niki', city: 'varna', age: 29, grade: 11 },
    ]

    $scope.filters = ['pesho', 'niki', 'gosho'];
	
    $scope.columnsToInclude = [
        { columnName: 'name', friendlyName: 'First Name' },
        { columnName: 'city', friendlyName: 'City of dwelling' }
    ];

    $scope.params = { filters: $scope.filters, data: $scope.data, columnsToInclude: $scope.columnsToInclude }
}])
.directive('testTable',function($compile){ 
	return {
        scope: {
			params: '='
		},
        restrict: "E",
        link: function (scope, element, attributes) {

            var initialFilters = scope.params.filters;
            var initialFiltersLength = scope.params.filters.length;

            scope.toggleFilters = function (filter) {
                if (scope.params.filters.indexOf(filter) > -1 && scope.params.filters.length == 1) {
                    scope.params.filters = initialFilters;
                } else if (scope.params.filters.indexOf(filter) > -1 && scope.params.filters.length == initialFiltersLength) {
                    scope.params.filters = [];
                    scope.params.filters.push(filter);
                } else if (scope.params.filters.indexOf(filter) > -1 && scope.params.filters.length > 1 && scope.params.filters.length <= initialFiltersLength) {
                    scope.params.filters.splice(scope.params.filters.indexOf(filter), 1);
                } else {
                    scope.params.filters.push(filter);
                }
            }

            scope.$watch('params.filters.length', function () {
                scope.displayedData = [];
                angular.forEach(scope.params.data, function (value) {
                    if (scope.params.filters.indexOf(value['name']) > -1) {
                        scope.displayedData.push(value);
                    }
                })
            });

            var constructTable = function () {
                var ths = '';
                angular.forEach(scope.params.columnsToInclude, function (value) {
                    ths += '<th>' + value.friendlyName + '</th>'
                });
                var thead = '<thead>' + ths + '</thead>';
                var tds = '';
                angular.forEach(scope.params.columnsToInclude, function (value) {
                    tds += '<td>{{item["' + value.columnName + '"]}}</td>'
                });
                var tbody = '<tbody><tr ng-repeat="item in displayedData">' + tds + '</tr></tbody>';
                var buttons = '<div class="text-right">';
                angular.forEach(initialFilters, function (value) {
                    buttons += '<div class="btn btn-sm btn-primary" ng-click="toggleFilters(\'' + value + '\')">' + value + '</div>'
                });
                buttons += '</div>';

                var table = '<table class="table table-striped">' + thead + tbody + '</table>';
                var container = '<div class="panel-default"><div class="panel-body">' + table + '</div></div>'
                return $compile(buttons + container)(scope);
            }

            element.append(constructTable());
        }
    };
})