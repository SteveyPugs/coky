app.controller("Orders", function($scope, $sessionStorage, $http){
	$http.get("/api/product").success(function(data){
		$scope.products = data;
		$scope.getProduct = function(id){
			var product = _.find($scope.products, function(i){
				if(id == i.ProductID) return true;
			});
			return product;
		};
	}).error(function(err){
		console.log(err);
	});
});