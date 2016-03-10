var app = angular.module("Bakery", ["ngStorage","bootstrap.fileField", "smart-table", "ngCookies", "ui.bootstrap", "ngFileUpload", "xeditable"]).run(function($rootScope, $http){
	$http.get("/api/product").success(function(data){
		for(var item in data){
			for(var key in data[item]){
				if(key === "Category"){
					data[item]["CategoryName"] = data[item][key].CategoryName;
					data[item]["CategoryID"] = data[item][key].CategoryID;
					delete data[item]["Category"];
				}
			}	
		}
		$rootScope.products = _.filter(data, {
			ProductStatus: 2
		});
		$http.get("/api/category").success(function(data){
			$rootScope.categories = data;
		}).error(function(err){
			console.log(err);
		});
	}).error(function(err){
		console.log(err);
	});
}).directive('stSelectDistinct', [function() {
	return {
		restrict: 'E',
		require: '^stTable',
		scope: {
			collection: '=',
			predicate: '@',
			predicateExpression: '='
		},
		template: '<select ng-model="selectedOption" class="input-sm form-control" ng-change="optionChanged(selectedOption)" ng-options="opt for opt in distinctItems"></select>',
		link: function(scope, element, attr, table) {
			var getPredicate = function() {
				var predicate = scope.predicate;
				if (!predicate && scope.predicateExpression) {
					predicate = scope.predicateExpression;
				}
				return predicate;
			}
			scope.$watch('collection', function(newValue) {
				var predicate = getPredicate();
				if (newValue) {
					var temp = [];
					scope.distinctItems = ['All'];
					angular.forEach(scope.collection, function(item) {
						var value = item[predicate];
						if (value && value.trim().length > 0 && temp.indexOf(value) === -1) {
							temp.push(value);
						}
					});
					temp.sort();
					scope.distinctItems = scope.distinctItems.concat(temp);
					scope.selectedOption = scope.distinctItems[0];
					scope.optionChanged(scope.selectedOption);
				}
			}, true);
			scope.optionChanged = function(selectedOption) {
				var predicate = getPredicate();
				var query = {};
				query.distinct = selectedOption;
				if (query.distinct === 'All') {
					query.distinct = '';
				}
				table.search(query, predicate);
			};
		}
	}
}]).filter('customFilter', ['$filter', function($filter) {
	var filterFilter = $filter('filter');
	var standardComparator = function standardComparator(obj, text) {
		text = ('' + text).toLowerCase();
		return ('' + obj).toLowerCase().indexOf(text) > -1;
	};
	return function customFilter(array, expression) {
		function customComparator(actual, expected) {
			var isBeforeActivated = expected.before;
			var isAfterActivated = expected.after;
			var isLower = expected.lower;
			var isHigher = expected.higher;
			var higherLimit;
			var lowerLimit;
			var itemDate;
			var queryDate;
			if (angular.isObject(expected)) {
				//exact match
				if (expected.distinct) {
					if (!actual || actual.toLowerCase() !== expected.distinct.toLowerCase()) {
						return false;
					}
					return true;
				}
				//matchAny
				if (expected.matchAny) {
					if (expected.matchAny.all) {
						return true;
					}
					if (!actual) {
						return false;
					}
					for (var i = 0; i < expected.matchAny.items.length; i++) {
						if (actual.toLowerCase() === expected.matchAny.items[i].toLowerCase()) {
							return true;
						}
					}
					return false;
				}
				//date range
				if (expected.before || expected.after) {
					try {
						if (isBeforeActivated) {
							higherLimit = expected.before;
							itemDate = new Date(actual);
							queryDate = new Date(higherLimit);
							if (itemDate > queryDate) {
								return false;
							}
						}
						if (isAfterActivated) {
							lowerLimit = expected.after;
							itemDate = new Date(actual);
							queryDate = new Date(lowerLimit);
							if (itemDate < queryDate) {
								return false;
							}
						}
						return true;
					} catch (e) {
						return false;
					}
				} else if (isLower || isHigher) {
					//number range
					if (isLower) {
						higherLimit = expected.lower;
						if (actual > higherLimit) {
							return false;
						}
					}
					if (isHigher) {
						lowerLimit = expected.higher;
						if (actual < lowerLimit) {
							return false;
						}
					}
					return true;
				}
				//etc
				return true;
			}
			return standardComparator(actual, expected);
		}
		var output = filterFilter(array, expression, customComparator);
		return output;
	};
}]).filter('range', function() {
	return function(input, total) {
		total = parseInt(total);
		for (var i=0; i<total; i++){
			input.push(i);
		}	
		return input;
	};
}).run(function(editableOptions){
	editableOptions.theme = "bs3";
});