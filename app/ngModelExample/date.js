'use strict';

angular.module('myApp.date', ['ngRoute'])
.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/date', {
    templateUrl: 'ngModelExample/date.html',
    controller: 'DateCtrl'
  });
}])
.constant('constVars', {
            "dateFormatRegex": /^(((0[1-9]|[12]\d|3[01])-(0[13578]|1[02])-((19|[2-9]\d)\d{2}))|((0[1-9]|[12]\d|30)-(0[13456789]|1[012])-((19|[2-9]\d)\d{2}))|((0[1-9]|1\d|2[0-8])-02-((19|[2-9]\d)\d{2}))|(29-02-((1[6-9]|[2-9]\d)(0[48]|[2468][048]|[13579][26])|((16|[2468][048]|[3579][26])00))))$/g
})
.controller('DateCtrl',['$scope', function($scope) {
	$scope.inputDate='';
	$scope.setInputDateToTodaysDate=function(){
		$scope.inputDate=new Date();
	}
}])
.directive('date',function(constVars,dateParserService){ 
	return {
        restrict: 'A',
        require: ['ngModel'],
        link: link
    };
	
	 function link(scope, element, attr, ctrls) {
        var ngModelController = ctrls[0];

        // called with a JavaScript Date object when picked from the datepicker
        ngModelController.$parsers.unshift(function (viewValue) {
                var date;
                if (angular.isString(viewValue)) {
                    if (!constVars.dateFormatRegex.test(viewValue)) return "invalid date";
                    else {
                        date = dateParserService.parse(viewValue, "dd-MM-yyyy");
                        if (isNaN(date)) {
                            return "invalid date";
                        }else{
							return date;
						}
                    }
                }
        });

        // called with a 'yyyy-mm-dd' string to format
        ngModelController.$formatters.push(function (modelValue) {
		if(angular.isDate(modelValue)){
			var result=modelValue.toISOString().substring(0, 10);
			return result;
		}
            return '';
        });
    }
})
.service('dateParserService', ['$locale', 'orderByFilter', function($locale, orderByFilter) {

    this.parsers = {};

    var formatCodeToRegex = {
        'yyyy': {
            regex: '\\d{4}',
            apply: function(value) { this.year = +value; }
        },
        'yy': {
            regex: '\\d{2}',
            apply: function(value) { this.year = +value + 2000; }
        },
        'y': {
            regex: '\\d{1,4}',
            apply: function(value) { this.year = +value; }
        },
        'MMMM': {
            regex: $locale.DATETIME_FORMATS.MONTH.join('|'),
            apply: function(value) { this.month = $locale.DATETIME_FORMATS.MONTH.indexOf(value); }
        },
        'MMM': {
            regex: $locale.DATETIME_FORMATS.SHORTMONTH.join('|'),
            apply: function(value) { this.month = $locale.DATETIME_FORMATS.SHORTMONTH.indexOf(value); }
        },
        'MM': {
            regex: '0[1-9]|1[0-2]',
            apply: function(value) { this.month = value - 1; }
        },
        'M': {
            regex: '[1-9]|1[0-2]',
            apply: function(value) { this.month = value - 1; }
        },
        'dd': {
            regex: '[0-2][0-9]{1}|3[0-1]{1}',
            apply: function(value) { this.date = +value; }
        },
        'd': {
            regex: '[1-2]?[0-9]{1}|3[0-1]{1}',
            apply: function(value) { this.date = +value; }
        },
        'EEEE': {
            regex: $locale.DATETIME_FORMATS.DAY.join('|')
        },
        'EEE': {
            regex: $locale.DATETIME_FORMATS.SHORTDAY.join('|')
        }
    };

    function createParser(format) {
        var map = [], regex = format.split('');

        angular.forEach(formatCodeToRegex, function(data, code) {
            var index = format.indexOf(code);

            if (index > -1) {
                format = format.split('');

                regex[index] = '(' + data.regex + ')';
                format[index] = '$'; // Custom symbol to define consumed part of format
                for (var i = index + 1, n = index + code.length; i < n; i++) {
                    regex[i] = '';
                    format[i] = '$';
                }
                format = format.join('');

                map.push({ index: index, apply: data.apply });
            }
        });

        return {
            regex: new RegExp('^' + regex.join('') + '$'),
            map: orderByFilter(map, 'index')
        };
    }

    this.parse = function(input, format) {
        if ( !angular.isString(input) || !format ) {
            return input;
        }

        format = $locale.DATETIME_FORMATS[format] || format;

        if ( !this.parsers[format] ) {
            this.parsers[format] = createParser(format);
        }

        var parser = this.parsers[format],
            regex = parser.regex,
            map = parser.map,
            results = input.match(regex);

        if ( results && results.length ) {
            var fields = { year: 1900, month: 0, date: 1, hours: 0 }, dt;

            for( var i = 1, n = results.length; i < n; i++ ) {
                var mapper = map[i-1];
                if ( mapper.apply ) {
                    mapper.apply.call(fields, results[i]);
                }
            }

            if ( isValid(fields.year, fields.month, fields.date) ) {
                dt = new Date( fields.year, fields.month, fields.date, fields.hours);
            }

            return dt;
        }
    };

    // Check if date is valid for specific month (and year for February).
    // Month: 0 = Jan, 1 = Feb, etc
    function isValid(year, month, date) {
        if ( month === 1 && date > 28) {
            return date === 29 && ((year % 4 === 0 && year % 100 !== 0) || year % 400 === 0);
        }

        if ( month === 3 || month === 5 || month === 8 || month === 10) {
            return date < 31;
        }

        return true;
    }
}]);
